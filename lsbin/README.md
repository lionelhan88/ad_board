# vue vite 项目docker镜像生成推送demo

## 1. 项目根目录中 
复制lsbin目录及其下文件到项目根目录中

## 2. package.json文件中增加

"scripts"中：

powershell:
"deploy": "vue-tsc --noEmit && vite build && xcopy \".\\lsbin\\conf\" \".\\dist\" && node lsbin\\deploy.cjs repo.jzdianzi.cn/larsson-www:1.0-SNAPSHOT"

bash:
"deploy": "rimraf dist && cross-env vite build && cp -r lsbin/conf/* dist && node lsbin/deploy.cjs repo.jzdianzi.cn/soec-agency-site:1.0-SNAPSHOT"

*repo.jzdianzi.cn/larsson-www:1.0-SNAPSHOT* 为要打包的镜像 名称:tag

"devDependencies"中：
"node-docker-api": "^1.1.22",
"tar-fs": "^2.1.1"

### 镜像名称 根据具体站点项目 把larsson-www替换成下列站点前缀
soec-organization-site
soec-agency-site
soec-bureau-site
soec-specialist-site
soec-admin-site

## 3. 使用
项目根目录下
> npm run deploy

