/* Original implementation. SPDX-License-Identifier: GPL-2.0-or-later */
(function (wp) {
  'use strict';
  var el = wp.element.createElement;
  var __ = wp.i18n.__;
  wp.blocks.registerBlockType('partly/split-expenses', {
    apiVersion: 3,
    title: __('Partly Split Expenses', 'partly-split-expenses-block'),
    description: __('Calculate shared expenses locally, without an account.', 'partly-split-expenses-block'),
    icon: 'calculator', category: 'widgets',
    attributes: {
      locale: { type: 'string', enum: ['en', 'fr', 'es'], default: 'en' },
      currency: { type: 'string', enum: ['EUR', 'USD', 'GBP', 'CHF', 'CAD'], default: 'EUR' },
      showCredit: { type: 'boolean', default: false }
    },
    supports: { html: false, customClassName: false, align: false },
    edit: function (props) {
      var ref = wp.element.useRef(null);
      var blockProps = wp.blockEditor.useBlockProps({ className: 'psb-calculator' });
      var attributes = props.attributes;
      wp.element.useEffect(function () {
        var instance = window.PartlySplitBlockUI.mount(ref.current, attributes);
        return function () { instance.destroy(); };
      }, [attributes.locale, attributes.currency, attributes.showCredit]);
      return el(wp.element.Fragment, null,
        el(wp.blockEditor.InspectorControls, null,
          el(wp.components.PanelBody, { title: __('Calculator settings', 'partly-split-expenses-block') },
            el(wp.components.SelectControl, {
              label: __('Language', 'partly-split-expenses-block'), value: attributes.locale,
              options: [{ label: 'English', value: 'en' }, { label: 'Français', value: 'fr' }, { label: 'Español', value: 'es' }],
              onChange: function (value) { props.setAttributes({ locale: value }); }, __nextHasNoMarginBottom: true
            }),
            el(wp.components.SelectControl, {
              label: __('Currency (no conversion)', 'partly-split-expenses-block'), value: attributes.currency,
              options: ['EUR', 'USD', 'GBP', 'CHF', 'CAD'].map(function (value) { return { label: value, value: value }; }),
              onChange: function (value) { props.setAttributes({ currency: value }); }, __nextHasNoMarginBottom: true
            }),
            el(wp.components.ToggleControl, {
              label: __('Show an optional Partly credit link', 'partly-split-expenses-block'),
              help: __('Off by default. This link is not required for any feature and sends no calculation data.', 'partly-split-expenses-block'),
              checked: attributes.showCredit === true, onChange: function (value) { props.setAttributes({ showCredit: value === true }); }, __nextHasNoMarginBottom: true
            })
          )
        ),
        el('div', Object.assign({}, blockProps, { ref: ref }))
      );
    },
    save: function () { return null; }
  });
}(window.wp));
