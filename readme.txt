=== Partly Split Expenses Block ===
Contributors: paul347
Tags: calculator, expenses, shared expenses, split bills, block
Requires at least: 6.5
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A local, private calculator block for shared expenses, custom shares and suggested reimbursements. No account, API or tracking.

== Description ==

Add a useful expense-splitting calculator directly to a travel guide, shared-house page or group welcome page. It is a native, independent WordPress block, not an iframe or a connection to a separate service.

Visitors can name participants, add several expenses with different payers, exclude people from a particular expense, set custom whole-number shares and calculate who owes whom. A balance table shows what everyone paid, their allocated share and their net balance. Suggested reimbursements offset those balances.

* English, French and Spanish interfaces, chosen in the block inspector.
* Equal or weighted shares for each expense; 0 in the form excludes a participant.
* Exact integer-cent calculations, including deterministic allocation of leftover cents.
* EUR, USD, GBP, CHF or CAD, selected by the editor. All expenses use one currency; no conversion.
* 2–30 participants and up to 100 expenses. Each expense is at most 1,000,000.00; the combined limit is 10,000,000.00.
* Labelled native inputs, keyboard-operable controls, status/error announcements and a balance table.
* No visitor account, cookies, local/session storage, analytics or API calls.
* All features are free. No key, paid plan, subscription or other plugin is required.
* An optional Partly credit link is off by default and can be enabled explicitly by the editor. It is never required for calculations.

These are arithmetic suggestions, not payments. The block does not initiate transfers, connect bank accounts, read WordPress users or access other site data. It does not promise the globally smallest possible number of transfers.

== Installation ==

1. In WordPress, choose Plugins > Add New > Upload Plugin and upload the complete ZIP.
2. Activate Partly Split Expenses Block.
3. Edit a post or page in the block editor, insert "Partly Split Expenses", and choose its language and currency in the block inspector.
4. Save or publish the page normally. The visitor calculator is ready without configuration or registration.

The optional credit switch is in the same inspector and starts off. Multiple calculator blocks on one page operate independently. The block is designed for the block editor; it adds no dashboard menu or shortcode.

== Frequently Asked Questions ==

= Where are the entered names and amounts stored? =

Only in the current calculator's browser memory. The block makes no network requests with them and does not save them in WordPress, cookies or browser storage. Reloading or leaving the page clears the entries. WordPress saves only the editor's language, currency and credit preference with the post. Other site plugins may have their own behavior; this block does not control them.

= How are indivisible cents split? =

For each expense, the calculator floors each exact proportional share, then gives remaining cents to the largest fractional remainders. Ties follow participant order. For example, splitting 10.01 across weights 1, 2 and 1 gives 2.50, 5.01 and 2.50. All allocated shares add up to the original amount.

= Can someone pay without sharing the expense? =

Yes. Choose that person as payer and set their weight to 0. At least one participant must have a positive share. Weights must be whole numbers from 0 to 10000. Removing a participant who paid an existing expense is blocked until those expenses are removed, so payments are never silently reassigned.

= Can I change or correct an expense? =

Remove it and add the corrected expense. Changing participants or expenses invalidates the displayed result; calculate again to see updated suggestions.

= Does the credit send calculation data to Partly? =

No. If the site editor explicitly enables it, the link points to the public calculator in the selected language, with no amounts, names, identifiers, fragment or tracking parameters. The link suppresses the referrer. Clicking it opens that separate website under its own privacy policy; this block never calls that site automatically.

= What source and build tools are included? =

All plugin JavaScript, CSS and PHP are original, readable source included in the ZIP. No build step, minifier, bundled third-party library or remote executable code is used. The code is licensed GPL-2.0-or-later.

== Changelog ==

= 1.0.0 =
* Initial independent block: multiple expenses, equal/weighted shares, deterministic cent rounding, balance table and settlement suggestions in English, French and Spanish.

== Upgrade Notice ==

= 1.0.0 =
Initial release. No visitor data is persisted or migrated.
