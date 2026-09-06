import type { Inquiry } from '../entities/inquiry.entity';

export interface HotelSelectionSnapshot {
  dayNumber: number;
  hotelName: string;
  roomTypeName: string;
  numberOfRooms: number;
  numberOfExtraBeds: number;
  calculatedTotal: number;
}

export interface InquirySnapshotData {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCountry?: string;
  packageName?: string;
  destinationName?: string;
  hotelSelections?: HotelSelectionSnapshot[];
}

export function generateInquiryVoucherHtml(inquiry: Inquiry): string {
  const snap = (inquiry.packageSnapshot ?? {}) as InquirySnapshotData;
  const formattedTravelDate = new Date(inquiry.travelDate).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  const hotelRows = (snap.hotelSelections ?? [])
    .map(
      (sel: HotelSelectionSnapshot) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Day ${String(sel.dayNumber)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>${sel.hotelName}</strong></td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${sel.roomTypeName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${String(sel.numberOfRooms)} Room(s) ${sel.numberOfExtraBeds > 0 ? `+ ${String(sel.numberOfExtraBeds)} Extra Bed` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${sel.calculatedTotal.toLocaleString()}</td>
    </tr>
  `,
    )
    .join('');

  const finalPrice = (
    inquiry.approvedTotal ?? inquiry.calculatedTotal
  ).toLocaleString();

  const clientName = inquiry.client.name;
  const clientEmail = inquiry.client.email ?? 'N/A';
  const clientPhone = inquiry.client.phone ?? 'N/A';
  const clientCountry = inquiry.client.country ?? 'N/A';
  const pkgName = inquiry.package.packageName;
  const destName = inquiry.destination.name;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Official Travel Voucher - ${inquiry.inquiryNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; margin: 0; padding: 40px; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
          .brand { font-size: 28px; font-weight: 800; color: #0284c7; }
          .badge { background: #dcfce7; color: #166534; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; }
          .card h3 { margin-top: 0; color: #0f172a; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; }
          .card p { margin: 6px 0; font-size: 14px; color: #475569; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; }
          th { background: #f1f5f9; color: #334155; text-align: left; padding: 12px 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          .total-box { background: #0284c7; color: #fff; padding: 20px; border-radius: 12px; text-align: right; }
          .total-box h2 { margin: 0; font-size: 26px; }
          .print-btn { background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 20px; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

        <div class="header">
          <div>
            <div class="brand">AuraTours Executive Travel</div>
            <div style="color: #64748b; font-size: 13px; margin-top: 4px;">Approved Booking Confirmation Voucher</div>
          </div>
          <div>
            <span class="badge">APPROVED</span>
            <div style="margin-top: 8px; text-align: right; font-weight: 700; color: #334155;">ID: ${inquiry.inquiryNumber}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h3>Client Information</h3>
            <p><strong>Full Name:</strong> ${clientName}</p>
            <p><strong>Email:</strong> ${clientEmail}</p>
            <p><strong>Phone:</strong> ${clientPhone}</p>
            <p><strong>Country:</strong> ${clientCountry}</p>
          </div>
          <div class="card">
            <h3>Package & Travel Details</h3>
            <p><strong>Package:</strong> ${pkgName}</p>
            <p><strong>Source:</strong> ${inquiry.source}</p>
            <p><strong>Destination:</strong> ${destName}</p>
            <p><strong>Travel Date:</strong> ${formattedTravelDate}</p>
            <p><strong>Guests:</strong> ${String(inquiry.adults)} Adults, ${String(inquiry.children)} Children</p>
          </div>
        </div>

        <h3>Selected Hotel Accommodations & Allocations</h3>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Hotel</th>
              <th>Room Type</th>
              <th style="text-align: center;">Allocation</th>
              <th style="text-align: right;">Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${hotelRows !== '' ? hotelRows : '<tr><td colspan="5">No hotel customization</td></tr>'}
          </tbody>
        </table>

        <div class="total-box">
          <div style="font-size: 14px; opacity: 0.9;">Total Approved Amount</div>
          <h2>$${finalPrice} USD</h2>
        </div>
      </body>
    </html>
  `;
}
