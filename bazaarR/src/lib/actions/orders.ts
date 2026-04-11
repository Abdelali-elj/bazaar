
import { adminDb } from "@/lib/firebase/admin";
;

export async function getOrders(userId?: string) {
  try {
    let query: FirebaseFirestore.Query = adminDb.collection("orders").orderBy("created_at", "desc");

    if (userId) {
      query = query.where("user_id", "==", userId);
    }

    const snapshot = await query.get();
    
    // Fetch products and users to populate references
    const productIds = new Set<string>();
    const userIds = new Set<string>();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      userIds.add(data.user_id);
      data.items?.forEach((item: any) => {
        if (item.product_id) productIds.add(item.product_id);
      });
    });

    const productsMap = new Map();
    if (productIds.size > 0) {
      // Note: Firestore 'in' queries support max 10 items. For large datasets, fetch individually or chunk.
      // Here we fetch individually for safety 
      await Promise.all(Array.from(productIds).map(async (pId) => {
        const pDoc = await adminDb.collection("products").doc(pId).get();
        if (pDoc.exists) productsMap.set(pId, { id: pDoc.id, ...pDoc.data() });
      }));
    }

    const usersMap = new Map();
    if (userIds.size > 0) {
      await Promise.all(Array.from(userIds).map(async (uId) => {
        const uDoc = await adminDb.collection("users").doc(uId).get();
        if (uDoc.exists) usersMap.set(uId, { id: uDoc.id, ...uDoc.data() });
      }));
    }

    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        profiles: usersMap.get(data.user_id) || null,
        order_items: (data.items || []).map((item: any) => ({
          ...item,
          products: productsMap.get(item.product_id) || null
        }))
      };
    });

    return orders;
  } catch (error: any) {
    console.error("[getOrders] Error:", error.message);
    throw new Error(error.message);
  }
}

export async function getOrderById(id: string) {
  try {
    const doc = await adminDb.collection("orders").doc(id).get();
    if (!doc.exists) return null;
    
    const data = doc.data() as any;
    const order = { id: doc.id, ...data };
    
    // Fetch user profile
    if (order.user_id) {
      const uDoc = await adminDb.collection("users").doc(order.user_id).get();
      if (uDoc.exists) {
         order.profiles = { id: uDoc.id, ...uDoc.data() };
      }
    }
    
    // Fetch products
    order.order_items = [];
    if (data.items && data.items.length > 0) {
       for (const item of data.items) {
          let product = null;
          if (item.product_id) {
             const pDoc = await adminDb.collection("products").doc(item.product_id).get();
             if (pDoc.exists) product = { id: pDoc.id, ...pDoc.data() };
          }
          order.order_items.push({ ...item, products: product });
       }
    }
    
    return order;
  } catch (error) {
    return null;
  }
}

export async function createOrder(items: { product_id: string; quantity: number; price_at_time: number }[], metadata?: any) {
  try {
    const { getUser } = await import("@/lib/actions/auth");
    const user = await getUser();
    
    const baseTotal = items.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0);
    const totalAmount = Math.max(0, baseTotal - (metadata?.discountAmount || 0));

    const orderId = adminDb.collection("orders").doc().id;
    const tracking_code = `VG-${orderId.slice(-5).toUpperCase()}`;

    const newOrder = { 
      user_id: user?.id || "guest", 
      total_amount: totalAmount, 
      status: "pending",
      tracking_code: tracking_code,
      created_at: new Date().toISOString(),
      items: items, // Storing items directly inside the order document
      ...metadata
    };

    await adminDb.collection("orders").doc(orderId).set(newOrder);

    // If a promo code was used, increment its usage count
    if (metadata?.promoCode) {
        try {
            const promoSnap = await adminDb.collection("promo_codes")
                .where("code", "==", metadata.promoCode)
                .limit(1)
                .get();
                
            if (!promoSnap.empty) {
                const promoDoc = promoSnap.docs[0];
                const currentUsed = promoDoc.data().timesUsed || 0;
                await promoDoc.ref.update({ timesUsed: currentUsed + 1 });
            }
        } catch (e) {
            console.error("[createOrder] Error incrementing promo code:", e);
        }
    }


    
    return { data: { id: orderId, ...newOrder } };
  } catch (err: any) {
    console.error("[createOrder] CRITICAL ERROR:", err);
    return { error: `Erreur interne: ${err.message || 'fetch failed'}` };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await adminDb.collection("orders").doc(id).update({ status });
    
    return { data: { id, status } };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDashboardStats() {
  try {
    // Basic stats implementation for Firebase
    const [ordersSnap, usersSnap, productsSnap] = await Promise.all([
      adminDb.collection("orders").get(),
      adminDb.collection("users").get(),
      adminDb.collection("products").get()
    ]);
    
    const totalOrders = ordersSnap.size;
    const totalUsers = usersSnap.size;
    const totalProducts = productsSnap.size;
    
    let totalRevenue = 0;
    const recentOrders = [];
    let count = 0;
    
    // Sort orders manually for recent and revenue
    const sortedOrders = ordersSnap.docs
       .map(d => ({ id: d.id, ...d.data() } as any))
       .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
       
    for (const order of sortedOrders) {
       totalRevenue += order.total_amount || 0;
       if (count < 5) {
          recentOrders.push(order);
          count++;
       }
    }
    
    // Fetch users for recent orders
    for (const order of recentOrders) {
       if (order.user_id) {
          const uDoc = await adminDb.collection("users").doc(order.user_id).get();
          if (uDoc.exists) order.profiles = { id: uDoc.id, ...uDoc.data() };
       }
    }
    
    return {
      totalRevenue,
      totalOrders,
      totalCustomers: totalUsers,
      totalProducts,
      recentOrders
    };
  } catch (error) {
    console.error("[getDashboardStats] Error:", error);
    return { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0, recentOrders: [] };
  }
}
export async function getOrderByTrackingCode(code: string) {
  try {
    const snapshot = await adminDb.collection("orders")
      .where("tracking_code", "==", code.trim().toUpperCase())
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const data = doc.data() as any;
    const order = { id: doc.id, ...data };
    
    // Fetch products
    order.order_items = [];
    if (data.items && data.items.length > 0) {
       for (const item of data.items) {
          let product = null;
          if (item.product_id) {
             const pDoc = await adminDb.collection("products").doc(item.product_id).get();
             if (pDoc.exists) product = { id: pDoc.id, ...pDoc.data() };
          }
          order.order_items.push({ ...item, products: product });
       }
    }
    
    return order;
  } catch (error) {
    console.error("[getOrderByTrackingCode] Error:", error);
    return null;
  }
}
