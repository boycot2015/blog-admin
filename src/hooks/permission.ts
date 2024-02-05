import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

export default function usePermission() {
    const userStore = useUserStore();
    return {
        accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
            return (
                !route.meta?.requiresAuth ||
                !route.meta?.roles ||
                route.meta?.roles?.includes('*') ||
                (route.meta.roles &&
                    userStore.roles?.includes(route.meta.roles[0] as never))
            );
        },
        findFirstPermissionRoute(_routers: any, roles: string[] | undefined) {
            const cloneRouters = [..._routers];
            while (cloneRouters.length) {
                const firstElement = cloneRouters.shift();
                if (
                    roles?.find((el: string) => {
                        return (
                            el === '*' || el === firstElement?.meta?.roles[0]
                        );
                    })
                )
                    return { name: firstElement.name };
                if (firstElement?.children) {
                    cloneRouters.push(...firstElement.children);
                }
            }
            return null;
        },
        // You can add any rules you want
    };
}
