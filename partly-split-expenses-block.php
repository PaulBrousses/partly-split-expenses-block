<?php
/**
 * Plugin Name: Partly Split Expenses Block
 * Description: A private, local split-expenses calculator block with multiple expenses, custom shares and settlement suggestions.
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * Author: Partly
 * Author URI: https://partly-app.com/
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: partly-split-expenses-block
 *
 * Original implementation; no application source or third-party library is bundled.
 *
 * @package PartlySplitExpensesBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Register local files and the single independent block. No endpoints or options. */
function partly_seb_register_block() {
	$version = '1.0.0';
	wp_register_script( 'partly-seb-engine', plugins_url( 'assets/engine.js', __FILE__ ), array(), $version, true );
	wp_register_script( 'partly-seb-copy', plugins_url( 'assets/copy.js', __FILE__ ), array(), $version, true );
	wp_register_script( 'partly-seb-runtime', plugins_url( 'assets/view.js', __FILE__ ), array( 'partly-seb-engine', 'partly-seb-copy' ), $version, true );
	wp_register_script( 'partly-seb-editor', plugins_url( 'assets/editor.js', __FILE__ ), array( 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n', 'partly-seb-runtime' ), $version, true );
	wp_set_script_translations( 'partly-seb-editor', 'partly-split-expenses-block' );
	wp_register_style( 'partly-seb-style', plugins_url( 'assets/style.css', __FILE__ ), array(), $version );
	register_block_type( __DIR__, array( 'render_callback' => 'partly_seb_render_block' ) );
}
add_action( 'init', 'partly_seb_register_block' );

/**
 * Render only a safe mount point. Visitor names and amounts never enter PHP.
 *
 * @param array $attributes Saved block settings controlled by the post editor.
 * @return string
 */
function partly_seb_render_block( $attributes ) {
	$locale   = isset( $attributes['locale'] ) && in_array( $attributes['locale'], array( 'en', 'fr', 'es' ), true ) ? $attributes['locale'] : 'en';
	$currency = isset( $attributes['currency'] ) && in_array( $attributes['currency'], array( 'EUR', 'USD', 'GBP', 'CHF', 'CAD' ), true ) ? $attributes['currency'] : 'EUR';
	$credit   = isset( $attributes['showCredit'] ) && true === $attributes['showCredit'] ? '1' : '0';
	$wrapper  = get_block_wrapper_attributes( array( 'class' => 'psb-calculator' ) );
	return sprintf(
		'<div %1$s data-psb-locale="%2$s" data-psb-currency="%3$s" data-psb-credit="%4$s"><p class="psb-loading">%5$s</p><noscript>%6$s</noscript></div>',
		$wrapper,
		esc_attr( $locale ),
		esc_attr( $currency ),
		esc_attr( $credit ),
		esc_html__( 'Split expenses calculator', 'partly-split-expenses-block' ),
		esc_html__( 'Enable JavaScript to calculate locally. No amounts or names are sent to a server.', 'partly-split-expenses-block' )
	);
}
