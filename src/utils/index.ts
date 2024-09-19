import CryptoJS from 'crypto-js';
import day from 'dayjs';

type TargetContext = '_self' | '_parent' | '_blank' | '_top';

export const openWindow = (
    url: string,
    opts?: { target?: TargetContext; [key: string]: any }
) => {
    const { target = '_blank', ...others } = opts || {};
    window.open(
        url,
        target,
        Object.entries(others)
            .reduce((preValue: string[], curValue) => {
                const [key, value] = curValue;
                return [...preValue, `${key}=${value}`];
            }, [])
            .join(',')
    );
};

export const regexUrl = new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i'
);
/** created by zch 2019-08-09
 * @description 采用DES对密码进行加密及解密
 */

// DES加密 Pkcs7填充方式
export const encryptByDES = (message: any, key: any) => {
    //   console.log(CryptoJS);
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString();
};
// DES解密
// export const decryptByDES = (ciphertext: any, key: any) => {
//   //   console.log(CryptoJS);
//   const keyHex = CryptoJS.enc.Utf8.parse(key);
//   // direct decrypt ciphertext
//   const decrypted = CryptoJS.DES.decrypt(
//     {
//       ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
//     },
//     keyHex,
//     {
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7,
//     }
//   );
//   return decrypted.toString(CryptoJS.enc.Utf8);
// };

// AES加密解密
/**
 * AES加密
 * @param data 加密字符
 * @param key 加密串
 */
export const aesEncrypt = (data: any, key?: string) => {
    key = key || '123456';
    const cipher = CryptoJS.AES.encrypt(data, key);
    return cipher.toString();
};
/**
 * AES解密
 * @param encrypted 解密字符
 * @param key 解密串
 */
export const aesDecrypt = (encrypted: any, key: string) => {
    key = key || '123456';
    const decrypted = CryptoJS.AES.decrypt(encrypted, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
};

export const timeFilter = (value: string | any[]) => {
    value = value.toString();
    if (value) {
        if (value.length === 13) {
            return day(Number(value)).format('YYYY-MM-DD HH:mm:ss');
        }
        return day.unix(Number(value)).format('YYYY-MM-DD HH:mm:ss');
    }
    return '-';
};
export const downloadFile = (url: string, fileName?: string) => {
    if (!url) return;
    const a = document.createElement('a');
    fetch(url) // 跨域时会报错
        .then((res) => res.blob())
        .then((blob) => {
            // 将链接地址字符内容转变成blob地址
            a.href = URL.createObjectURL(blob);
            a.download = fileName || url.split('/')[url.split('/').length - 1]; // 下载文件的名字
            a.download += '.png';
            document.body.appendChild(a);
            a.click();
            // 在资源下载完成后 清除 占用的缓存资源
            window.URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
        });
};
/**
 * 数组转tree
 * @param arr 数组
 * @param props { pid: 'pid', children: 'children' }
 * @returns arr[] tree
 */
export const convertArrayToTree = (
    arr: any,
    props = { pid: 'pid', id: 'id', children: 'children' }
) => {
    const map: any = {}; // 用于存放每个节点对应的索引位置
    arr.forEach((item: any, index: number) => {
        item[props.children] = []; // 初始化子节点列表
        map[index] = item; // 记录当前节点在原数组中的位置
    });

    const result: any = []; // 最后返回的树形结果
    arr.forEach((item: any, index: number) => {
        if (map[index][props.pid] !== null) {
            // 判断该节点有没有父节点
            const parentIndex = arr.findIndex(
                (el: any) => el[props.id] === map[index][props.pid]
            ); // 获取父节点在原数组中的位置
            if (map[parentIndex] && map[parentIndex][props.children]) {
                map[parentIndex][props.children].push(item); // 添加到父节点的子节点列表中
            } else {
                result.push(item); // 若无父节点则直接作为根节点
            }
        } else {
            result.push(item); // 若无父节点则直接作为根节点
        }
    });

    return result;
};
/**
 *
 * @param arr 树数据
 * @param props { children: 'children' }
 * @param match function 匹配表达式
 * @returns 所有子集
 */
export const getAllChild = (
    arr: any,
    props = { children: 'children' },
    match = (p?: any) => !!p
) => {
    return arr.reduce(
        (prev: any, next: any) =>
            match(next)
                ? prev.concat(
                      getAllChild(next[props.children] || [], props, match)
                  )
                : [],
        arr
    );
};
export const hexToRgb = (hex: string, showRgb?: boolean) => {
    // 去除#号
    const color = hex.replace('#', '');
    // 分割成红、绿、蓝三部分的十六进制字符串
    const red = parseInt(color.substring(0, 2), 16);
    const green = parseInt(color.substring(2, 4), 16);
    const blue = parseInt(color.substring(4, 6), 16);
    return showRgb
        ? `rgb(${red}, ${green}, ${blue})`
        : `${red}, ${green}, ${blue}`;
};
export default null;

export const exportFile = ({
    data,
    name,
    type = 'json',
}: {
    data: string;
    name: string;
    type: 'md' | 'json' | 'text';
}) => {
    // 要保存的字符串
    if (type === 'json' || typeof data === 'object') {
        data = JSON.stringify(data, null, 2);
    }
    // data 表示要转换的字符串数据，type 表示要转换的数据格式
    const blob = new Blob([data], {
        type:
            // eslint-disable-next-line no-nested-ternary
            type === 'md'
                ? 'text/markdown'
                : type === 'json'
                ? 'application/json'
                : 'text/plain;charset=utf-8',
    });
    // 根据 blob生成 url链接
    const objectURL = URL.createObjectURL(blob);

    // 创建一个 a 标签Tag
    const aTag = document.createElement('a');
    // 设置文件的下载地址
    aTag.href = objectURL;
    // 设置保存后的文件名称
    aTag.download = `${name}.${type}`;
    // 给 a 标签添加点击事件
    aTag.click();
    // 释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。
    // 当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
    URL.revokeObjectURL(objectURL);
};
