## Todos
---
- [x] 通过底图图层下拉框可以改变地图的不同的图层
- [ ] 将老师发的data中的shp数据叠加到openlayer的图层中
- [ ] 设计表单
#### 后端内容
- [ ] 设计5种不同数据的数据表
- [ ] PostgreSQL+postGIS 铁路线路(geoJson?)数据入库


## 系统设计
## 前端

> 数据类型： 文档、数据、样本、算法、案例
> 数据的公共属性： 名称、类别、描述、本地路径、webURL、时间、位置（关联路段，下拉选择）

### 表单设计

名称、类别、描述、时间、位置（关联路段，下拉选择）

## 数据库

名称(character(120))、类别(character(120))、描述(text)、本地路径(varchar)、webURL(varchar)、时间(timestamp [ (*p*) ] [ without time zone ])、位置(varchar)


