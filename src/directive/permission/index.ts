import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

const checkPermission = (
  el: HTMLElement | any,
  binding?: DirectiveBinding
): boolean => {
  const { value } = binding || el;
  const userStore = useUserStore();
  const { roles } = userStore;

  if (Array.isArray(value)) {
    if (value) {
      const permissionValues = value;
      const hasPermission = permissionValues.find((val) =>
        roles?.includes(val as never)
      );
      if (!hasPermission && el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
      return hasPermission;
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','user']"`);
  }
  return false;
};
export { checkPermission };
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
