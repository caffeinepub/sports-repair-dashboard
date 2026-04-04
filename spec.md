# Sports Repair Dashboard

## Current State
- The app has separate job forms: `JobForm` (customer jobs) and `ShopJobForm` (shop jobs)
- Both share a single `JobDetail` side sheet for viewing job details
- A `ServiceBill` component provides a printable bill for shop jobs
- There is no dedicated printable job sheet for customer bookings
- The `JobDetail` currently shows "Shop Information" section labels even for customer jobs (labels say "Shop Name", "Contact Person" instead of "Customer Name")
- Reports page has separate tabs for customer and shop job reports

## Requested Changes (Diff)

### Add
- `CustomerJobSheet` component: A printable job sheet specifically for customer booking jobs. Shows customer name, mobile, job details, service type, date, payment summary. Has a print button and WhatsApp share button.
- `ShopJobSheet` component (or update `ServiceBill`): A printable job sheet specifically for sports shop jobs. Shows shop name, person name, place, no. of rackets, model, service charges, payment summary.
- Print/View Job Sheet button visible in both `JobsList` and `ShopJobsList` row actions, and in `JobDetail` view.

### Modify
- `JobDetail` component: Update the "Shop Information" section to display correct labels based on `jobCategory`. For customer jobs, show "Customer Name", "Mobile No" instead of "Shop Name", "Contact Person". For shop jobs, keep existing shop labels.
- `JobsList` page: Add a "Job Sheet" or "Print Sheet" action button per row that opens the appropriate printable sheet.
- `ShopJobsList` page: Add a "Job Sheet" or "Print Sheet" action button per row that opens the shop job sheet/bill.
- `App.tsx`: Wire up new sheet components and open handlers for customer job sheet.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `CustomerJobSheet` component: A modal/sheet with a clean printable layout for customer jobs. Fields: Customer Name (personName), Mobile (customerMobile), Type of Work, Date, Job Description, Payment Mode, Total Amount, Advanced, Balance. Include Print and WhatsApp buttons.
2. Update `JobDetail` to show appropriate labels based on `jobCategory` ("customer" vs "shop").
3. Update `App.tsx` to add state and handlers for `CustomerJobSheet` open/close.
4. Update `JobsList` to add a "Print Sheet" icon button per row.
5. Update `ShopJobsList` to add a "Print Sheet" icon button per row (opens existing `ServiceBill` or new `ShopJobSheet`).
6. Ensure both sheets are printable and styled cleanly.
