import { NextRequest, NextResponse } from 'next/server'
import { getInvoiceData } from '@/lib/actions/billing'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params

    if (!orderId) {
        return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const invoice = await getInvoiceData(orderId)

    if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found or unauthorized' }, { status: 404 })
    }

    const html = generateInvoiceHtml(invoice)

    return NextResponse.json({
        html,
        invoiceNumber: invoice.invoiceNumber,
    })
}

function generateInvoiceHtml(invoice: NonNullable<Awaited<ReturnType<typeof getInvoiceData>>>) {
    const orderDate = new Date(invoice.orderDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })
    const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })
    const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

    const itemRows = invoice.items.map(item => `
        <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #27272a;">${item.productName}</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #52525b; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #52525b; text-align: right;">${formatCurrency(item.unitPrice)}</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e4e4e7; font-size: 14px; font-weight: 600; color: #09090b; text-align: right;">${formatCurrency(item.lineTotal)}</td>
        </tr>
    `).join('')

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice.invoiceNumber} — Xpress Buke</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f5; padding: 40px 20px; color: #09090b; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden; }
        .header { background: linear-gradient(135deg, #059669, #10b981); padding: 40px; color: white; }
        .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
        .header p { opacity: 0.85; font-size: 14px; }
        .meta { display: flex; justify-content: space-between; padding: 32px 40px; border-bottom: 1px solid #e4e4e7; }
        .meta-block h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; font-weight: 700; margin-bottom: 8px; }
        .meta-block p { font-size: 14px; color: #27272a; line-height: 1.6; }
        .meta-block .highlight { font-size: 20px; font-weight: 800; color: #059669; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 12px 16px; background: #f4f4f5; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; font-weight: 700; text-align: left; }
        thead th:last-child, thead th:nth-child(3) { text-align: right; }
        thead th:nth-child(2) { text-align: center; }
        .totals { padding: 24px 40px; text-align: right; border-top: 2px solid #e4e4e7; }
        .totals .total-row { display: flex; justify-content: flex-end; gap: 40px; margin-bottom: 8px; font-size: 14px; }
        .totals .total-row span:first-child { color: #71717a; }
        .totals .total-row.grand { font-size: 20px; font-weight: 800; color: #09090b; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e4e4e7; }
        .footer { padding: 24px 40px; background: #fafafa; border-top: 1px solid #e4e4e7; text-align: center; font-size: 12px; color: #a1a1aa; }
        @media print { body { padding: 0; background: white; } .invoice-container { box-shadow: none; border-radius: 0; } }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>INVOICE</h1>
            <p>Xpress Buke B2B Marketplace</p>
        </div>

        <div class="meta">
            <div class="meta-block">
                <h3>Invoice Number</h3>
                <p class="highlight">${invoice.invoiceNumber}</p>
            </div>
            <div class="meta-block">
                <h3>Issue Date</h3>
                <p>${orderDate}</p>
            </div>
            <div class="meta-block">
                <h3>Due Date</h3>
                <p style="font-weight: 700; color: #059669;">${dueDate}</p>
            </div>
            <div class="meta-block">
                <h3>Terms</h3>
                <p>${invoice.paymentTerms}</p>
            </div>
        </div>

        <div class="meta">
            <div class="meta-block">
                <h3>Bill To</h3>
                <p style="font-weight: 600;">${invoice.shopBusinessName}</p>
                <p>${invoice.shopName}</p>
            </div>
            <div class="meta-block">
                <h3>Supplier</h3>
                <p style="font-weight: 600;">${invoice.supplierName}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows}
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal</span>
                <span>${formatCurrency(invoice.subtotal)}</span>
            </div>
            <div class="total-row grand">
                <span>Total Due</span>
                <span>${formatCurrency(invoice.total)}</span>
            </div>
        </div>

        <div class="footer">
            <p>This invoice was generated by Xpress Buke B2B Marketplace. Payment is due by ${dueDate}.</p>
            <p style="margin-top: 4px;">For questions, contact your account representative.</p>
        </div>
    </div>
</body>
</html>`
}
