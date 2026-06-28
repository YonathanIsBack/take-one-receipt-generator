import {
  Plus,
  Printer,
  Receipt,
  ShoppingBag,
  Sliders,
  Store,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import "./App.css";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

function App() {
  const [theme, setTheme] = useState<"thermal" | "modern" | "retro">("thermal");
  const [merchantName, setMerchantName] = useState("Take One");
  const [instagram, setInstagram] = useState("@takeone");
  const [receiptNo, setReceiptNo] = useState("TO-2026-8942");
  const [customerName, setCustomerName] = useState("");


  const getTodayDateString = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [date, setDate] = useState(getTodayDateString());
  const [cashier] = useState("Admin");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  const [taxRate] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [currency, setCurrency] = useState("Rp");
  const [footerMsg, setFooterMsg] = useState(
    "Thank you for shopping with us!\nVisit again soon!"
  );

  const [items, setItems] = useState<ReceiptItem[]>([
  ]);

  const itemPrices: Record<string, number> = {
    "Dubai Chewy Cookie": 40000,
    "OG Saltbread": 20000,
    "Choco Saltbread": 23000,
    "Delivery Fee": 0,
  };

  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    const price = parseFloat(newItemPrice);
    const qty = parseInt(newItemQty) || 1;

    if (isNaN(price) || price < 0) return;

    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      price,
      qty,
    };

    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemQty("1");
  };

  const handleUpdateItem = (
    id: string,
    field: keyof ReceiptItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          if (field === "price") {
            const parsed = parseFloat(value as string);
            return { ...item, price: isNaN(parsed) ? 0 : parsed };
          }
          if (field === "qty") {
            const parsed = parseInt(value as string);
            return { ...item, qty: isNaN(parsed) ? 1 : parsed };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxRate / 100);
  const total = taxableAmount + taxAmount;

  const formatAmount = (value: number) => {
    if (currency === "Rp") {
      return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
    }
    return `${currency}${value.toFixed(2)}`;
  };

  const formatDateForReceipt = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handlePrint = () => {
    window.print();
  };



  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">
            <Receipt size={20} />
          </div>
          <h1>TAKE ONE</h1>
        </div>
        <div className="theme-selector-tabs">
          <div
            className={`theme-tab ${theme === "thermal" ? "active" : ""}`}
            onClick={() => setTheme("thermal")}
          >
            Thermal
          </div>
          <div
            className={`theme-tab ${theme === "modern" ? "active" : ""}`}
            onClick={() => setTheme("modern")}
          >
            Modern
          </div>
          <div
            className={`theme-tab ${theme === "retro" ? "active" : ""}`}
            onClick={() => setTheme("retro")}
          >
            Retro
          </div>
        </div>
      </header>

      <main className="main-layout">
        <section className="editor-panel">
          <div className="card">
            <h2 className="card-title">
              <Store size={18} /> Merchant Details
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="m-name">Business Name</label>
                <input
                  id="m-name"
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="m-ig">Instagram Account</label>
                <input
                  id="m-ig"
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">
              <Receipt size={18} /> Transaction Info
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="t-no">Receipt Number</label>
                <input
                  id="t-no"
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="t-customer">Customer Name</label>
                <input
                  id="t-customer"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in Customer"
                />
              </div>
              <div className="form-group">
                <label htmlFor="t-cashier">Cashier / Staff</label>
                <input id="t-cashier" type="text" value={cashier} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="t-date">Date</label>
                <input
                  id="t-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="t-pay">Payment Method</label>
                <select
                  id="t-pay"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="QRIS">QRIS</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="t-curr">Currency</label>
                <select
                  id="t-curr"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="Rp">Rupiah (Rp)</option>
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="¥">JPY (¥)</option>
                  <option value="₹">INR (₹)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="card-title">
              <ShoppingBag size={18} /> Receipt Items
            </h2>

            <div className="items-list-header">
              <span>Item Name</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
              <span></span>
            </div>
            <div className="items-list-container">
              {items.map((item) => (
                <div key={item.id} className="item-row">
                  <select
                    value={item.name}
                    aria-label="Item name"
                    disabled
                    onChange={(e) => {
                      const name = e.target.value;
                      handleUpdateItem(item.id, "name", name);
                      handleUpdateItem(item.id, "price", itemPrices[name] ?? 0);
                    }}
                  >
                    <option value="Dubai Chewy Cookie">
                      Dubai Chewy Cookie
                    </option>
                    <option value="OG Saltbread">OG Saltbread</option>
                    <option value="Choco Saltbread">Choco Saltbread</option>
                    <option value="Delivery Fee">Delivery Fee</option>
                  </select>
                  <input
                    type="number"
                    step="1"
                    aria-label="Item price"
                    value={item.price === 0 ? "" : item.price}
                    onChange={(e) =>
                      handleUpdateItem(item.id, "price", e.target.value)
                    }
                    placeholder="Price"
                  />
                  <input
                    type="number"
                    min="1"
                    aria-label="Item quantity"
                    value={item.qty}
                    onChange={(e) =>
                      handleUpdateItem(item.id, "qty", e.target.value)
                    }
                    placeholder="Qty"
                  />
                  <input
                    type="text"
                    aria-label="Item total"
                    value={formatAmount(item.price * item.qty)}
                    disabled
                  />
                  <button
                    type="button"
                    className="btn btn-danger delete-btn"
                    onClick={() => handleDeleteItem(item.id)}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div
              className="divider"
              style={{
                borderTop: "1px solid var(--border-color)",
                margin: "1.25rem 0",
              }}
            ></div>

            <form
              onSubmit={handleAddItem}
              className="item-row"
              style={{ marginTop: "0.5rem" }}
            >
              <select
                value={newItemName}
                aria-label="New item name"
                onChange={(e) => {
                  const name = e.target.value;
                  setNewItemName(name);
                  setNewItemPrice(name ? String(itemPrices[name]) : "");
                }}
                required
              >
                <option value="">Select item...</option>
                <option value="Dubai Chewy Cookie">Dubai Chewy Cookie</option>
                <option value="OG Saltbread">OG Saltbread</option>
                <option value="Choco Saltbread">Choco Saltbread</option>
                <option value="Delivery Fee">Delivery Fee</option>
              </select>
              <input
                type="number"
                step="1"
                placeholder="Price"
                value={newItemPrice}
                aria-label="New item price"
                onChange={(e) => setNewItemPrice(e.target.value)}
                required
              />
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={newItemQty}
                aria-label="New item quantity"
                onChange={(e) => setNewItemQty(e.target.value)}
              />
              <input
                type="text"
                aria-label="New item total"
                value={formatAmount(
                  parseFloat(newItemPrice || "0") * parseInt(newItemQty || "1")
                )}
                disabled
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: "0.65rem 1rem" }}
              >
                <Plus size={16} /> Add
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="card-title">
              <Sliders size={18} /> Adjustments & Footer
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="adj-disc">Discount (%)</label>
                <input
                  id="adj-disc"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(
                      Math.min(
                        100,
                        Math.max(0, parseFloat(e.target.value) || 0)
                      )
                    )
                  }
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="adj-foot">Footer Message</label>
                <textarea
                  id="adj-foot"
                  rows={2}
                  value={footerMsg}
                  onChange={(e) => setFooterMsg(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="preview-panel">
          <div className="preview-actions">
            <button
              className="btn btn-primary"
              onClick={handlePrint}
              style={{ width: "100%" }}
            >
              <Printer size={18} /> Print Receipt
            </button>
          </div>

          <div className={`receipt-wrapper receipt-theme-${theme}`}>
            <div className="receipt-header">
              <div className="title-large">{merchantName}</div>
              {instagram && (
                <div className="receipt-subtitle">IG: {instagram}</div>
              )}
            </div>

            <div className="divider"></div>

            <div className="receipt-details">
              <div className="receipt-detail-row">
                <span>Date:</span>
                <span>{formatDateForReceipt(date)}</span>
              </div>
              <div className="receipt-detail-row">
                <span>Customer:</span>
                <span>{customerName || "Walk-in"}</span>
              </div>
              <div className="receipt-detail-row">
                <span>Cashier:</span>
                <span>{cashier}</span>
              </div>
              <div className="receipt-detail-row">
                <span>Pay Method:</span>
                <span>{paymentMethod}</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="receipt-items-header">
              <span>Item Description</span>
              <span>Total</span>
            </div>

            <div className="divider"></div>

            <div className="receipt-items">
              {items.map((item) => (
                <div key={item.id} className="receipt-item-row">
                  <div className="receipt-item-name">
                    {item.name}
                    <span className="receipt-item-qty-price">
                      ({item.qty} x {formatAmount(item.price)})
                    </span>
                  </div>
                  <span className="receipt-item-total">
                    {formatAmount(item.price * item.qty)}
                  </span>
                </div>
              ))}
              {items.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    opacity: 0.5,
                    fontStyle: "italic",
                    padding: "1rem 0",
                  }}
                >
                  No items listed
                </div>
              )}
            </div>

            <div className="divider"></div>

            {/* Totals */}
            <div className="receipt-totals">
              <div className="receipt-total-row">
                <span>Subtotal:</span>
                <span>{formatAmount(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div
                  className="receipt-total-row"
                  style={{ color: theme === "retro" ? "#4ade80" : "#b91c1c" }}
                >
                  <span>Discount ({discount}%):</span>
                  <span>-{formatAmount(discountAmount)}</span>
                </div>
              )}
              {taxRate > 0 && (
                <div className="receipt-total-row">
                  <span>Tax ({taxRate}%):</span>
                  <span>{formatAmount(taxAmount)}</span>
                </div>
              )}
              <div
                className="divider"
                style={{ borderTopStyle: "dotted" }}
              ></div>
              <div className="receipt-total-row grand-total">
                <span>TOTAL:</span>
                <span>{formatAmount(total)}</span>
              </div>
            </div>

            {footerMsg && (
              <>
                <div className="divider"></div>
                <div className="receipt-footer">{footerMsg}</div>
              </>
            )}


          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
