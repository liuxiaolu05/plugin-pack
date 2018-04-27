/**
 * Created by weikaiwei on 2017/7/7.
 */
define( [
    "jquery/src/core",
    "jquery/src/selector",
    "jquery/src/traversing",
    "jquery/src/core/ready",
    "jquery/src/data",
    "jquery/src/attributes",
    "jquery/src/event",
    "jquery/src/event/focusin",
    "jquery/src/event/alias",
    "jquery/src/manipulation",
    // "jquery/src/wrap",
    "jquery/src/css",
    "jquery/src/effects",
    "jquery/src/effects/animatedSelector",
    "jquery/src/offset",
    "jquery/src/deprecated",
    "jquery/src/dimensions"
], function( jQuery ) {
    return ( self.jQuery = self.$ = jQuery );

} );