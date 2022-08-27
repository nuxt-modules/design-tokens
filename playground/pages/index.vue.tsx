
export default await (async () => {
const __VLS_setup = async () => {
const variants = ref([])

const makeRounded = () => {
  variants.value.push('rounded')
}
const __VLS_Component = (await import('vue')).defineComponent({
setup() {
return {
};
},
});
function __VLS_template() {
import * as __VLS_types from './__VLS_types.js';
const __VLS_types: typeof import('./__VLS_types.js');

const __VLS_options = {
};

let __VLS_name!: 'index';
let __VLS_ctx!: __VLS_types.PickNotAny<__VLS_Ctx, {}> & InstanceType<__VLS_types.PickNotAny<typeof __VLS_Component, new () => {}>> & InstanceType<__VLS_types.PickNotAny<typeof __VLS_component, new () => {}>> & {
};
let __VLS_vmUnwrap!: typeof __VLS_options & { components: { } };
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_component extends { components: infer C } ? C : {}> & __VLS_types.GlobalComponents & typeof __VLS_vmUnwrap.components & __VLS_types.PickComponents<typeof __VLS_ctx>;
let __VLS_selfComponent!: __VLS_types.SelfComponent<typeof __VLS_name, typeof __VLS_component & (new () => { $slots: typeof __VLS_slots })>;
let __VLS_components!: typeof __VLS_otherComponents & Omit<typeof __VLS_selfComponent, keyof typeof __VLS_otherComponents>;
__VLS_components./* __VLS_.SearchTexts.Components */;
({} as __VLS_types.GlobalAttrs)./* __VLS_.SearchTexts.GlobalAttrs */;
/* Style Scoped */
type __VLS_StyleScopedClasses = {}
 & { 'app'?: boolean }
 & { 'primary'?: boolean }
 & { 'primary'?: boolean }
 & { 'primary'?: boolean };
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
declare const Block: __VLS_types.ConvertInvalidJsxElement<
'Block' extends keyof typeof __VLS_components ? typeof __VLS_components['Block'] : 
'Block' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx['Block'] : unknown>;
__VLS_components.Block;
__VLS_components.Block;
__VLS_components.Block;
__VLS_components.Block;
__VLS_components.Block;
__VLS_ctx.Block;
__VLS_ctx.Block;
__VLS_ctx.Block;
__VLS_ctx.Block;
__VLS_ctx.Block;
declare const __VLS_0: __VLS_types.ExtractEmit2<typeof Block>;
/* Completion: Emits */
// @ts-ignore
__VLS_0('/* __VLS_.SearchTexts.Completion.Emit.Block */');
/* Completion: Props */
// @ts-ignore
(<Block /* __VLS_.SearchTexts.Completion.Props.Block *//>);
{
<div class={"\u0061\u0070\u0070"} ></div>
{
<header ></header>
{
<span ></span>
}
}
{
<section ></section>
{
<button style={undefined} ></button>
const __VLS_7: {
'click': __VLS_types.FillingEventArg<
__VLS_types.GlobalAttrs['onClick'],
>
} = {
click: (__VLS_ctx.makeRounded)};
[makeRounded,];
}
{
<Block primary={true} />
}
{
<Block lila={true} />
}
{
<Block lavender={true} />
}
{
<Block velvet={true} />
}
{
<Block grape={true} />
}
}
{
<footer ></footer>
{
<span ></span>
( 'Footer' );
}
{
<span ></span>
}
}
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
__VLS_styleScopedClasses['app'];
}
declare var __VLS_slots:
{
};
return __VLS_slots;
}
const __VLS_component = (await import('vue')).defineComponent({
setup() {
return {
makeRounded: makeRounded,
};
},
});
return {} as typeof __VLS_Component & (new () => { $slots: ReturnType<typeof __VLS_template> });
};
return await __VLS_setup();
})();

declare const $dt: import('@nuxtjs/design-tokens').DtFunctionType
type ComponentTemplateTags__VLS = {
  /**
   * The `<div>` tag from the Vue template.
   */
  div: true,
  /**
   * The `<header>` tag from the Vue template.
   */
  header: true,
  /**
   * The `<span>` tag from the Vue template.
   */
  span: true,
  /**
   * The `<section>` tag from the Vue template.
   */
  section: true,
  /**
   * The `<button>` tag from the Vue template.
   */
  button: true,
  /**
   * The `<Block>` tag from the Vue template.
   */
  Block: true,
  /**
   * The `<footer>` tag from the Vue template.
   */
  footer: true,

}

declare const $variantsProps: (key: keyof ComponentTemplateTags__VLS) => {}

const __VLS_$dt_colorsPrimary100_147 = $dt('colors.primary.100')

const __VLS_$dt_colorsPrimary200_223 = $dt('colors.primary.200')

const __VLS_$dt_colorsPrimary900_292 = $dt('colors.primary.900')

const __VLS_$dt_colorsBlack_476 = $dt('colors.black')

const __VLS_$dt_colorsBlack_752 = $dt('colors.black')

const __VLS_$dt_colorsBlack_950 = $dt('colors.black')
