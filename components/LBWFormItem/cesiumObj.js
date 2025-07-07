import * as Cesium2 from 'cesium';

// import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css';

const viewer = null;
const globalData = window.microApp?.getData();
const pointType = 2;
const callback = null;
let cartesian1; // 射线与地球表面之间的交点
let activeShapePoints = []; // 存储多边形顶点
let activeShape; // 动态绘制中的多边形
let finishedShape; // 绘制完成的多边形
let currentEntity = null; // 用来保存当前点击的实体

const Cesium = window.__MICRO_APP_ENVIRONMENT__ ? globalData.Cesium : Cesium2;
export class myCesium {
  constructor(
    id,
    {
      changeRightMiddle = true, // 是否更改右键和中间键功能默认true
      useTian = false, // 是否使用天地图
    } = {},
  ) {
    this.viewer = null;
    Cesium.Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZDE3NDRhZC1lMGFmLTRhZTEtOWZiZi1mMzQ5OTQwNzNlYjYiLCJpZCI6MjU5MDI2LCJpYXQiOjE3MzI5Mjc3NDV9.GpZHSE64NUUO85FbrIF8gxRdXMCAfa3zrGQmXQ-lZzc';

    this.viewer = new Cesium.Viewer(id, {
      timeline: false, // 时间线
      animation: false, // 动画
      geocoder: false, // 地理编码
      homeButton: false, // 主页按钮
      sceneModePicker: false, // 场景模式选择器
      baseLayerPicker: false, // 基础图层选择器
      navigationHelpButton: false, // 导航帮助按钮
      fullscreenButton: false, // 全屏按钮
      selectionIndicator: false, // 绿色的定位框
    });
    this.viewer.scene.highResolutionScroll = true;

    // // //改善实体的文字和图片清晰度
    this.viewer.scene.fxaa = false;

    if (changeRightMiddle) {
      this.#changeRightMiddle();
    }
    if (useTian) {
      this.#useTianditu();
    }
    // // 初始化相机视图
    // this.viewer.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(116.397428, 39.90923, 1000), // 北京天安门，海拔 1000 米
    //   orientation: {
    //     heading: Cesium.Math.toRadians(0), // 朝向角度（北）
    //     pitch: Cesium.Math.toRadians(-90), // 俯仰角
    //     roll: 0, // 翻滚角度
    //   },
    // });
    const longitude = 118.3433;
    const latitude = 33.96;
    const height = 10_000; // 视角高度，单位为米
    // 将视角移动到宿豫区区政府
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
      orientation: {
        heading: Cesium.Math.toRadians(0), // 方向
        pitch: Cesium.Math.toRadians(-90), // 倾斜角度
        roll: 0, // 翻滚角度
      },
    });

    const handler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas,
    );

    // 监听鼠标左键点击事件
    handler.setInputAction((click) => {
      console.log('pointType', pointType);
      if (this.pointType === 0) {
        this.viewer.entities.removeAll();
        this.Cesium;
        // 获取点击位置的地理坐标
        const pickedObject = this.viewer.scene.pick(click.position);
        if (!pickedObject) {
          const cartesian = this.viewer.camera.pickEllipsoid(
            click.position,
            this.viewer.scene.globe.ellipsoid,
          );
          if (cartesian) {
            // 将笛卡尔坐标转换为地理坐标
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            console.log('longitude latitude', longitude, latitude);
            
            this.viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
              billboard: {
                image:
                  'https://kdimage20200722.oss-cn-shenzhen.aliyuncs.com/kdimage20200722/root/projecthelper/ff55a6c02d2f4740a8cbc352ff0c141b.png',
                width: 32,
                height: 32,
              },
              label: {
                text: '定位点',
                font: '18px sans-serif',
                pixelOffset: new Cesium.Cartesian2(0, -32),
              },
            });
            if (this.callback) {
              this.callback(longitude, latitude);
            }
            // 移除自动缩放功能
            // this.viewer.zoomTo(this.viewer.entities);
          }
        }
      }
      if (this.pointType === 1) {
        // 多边形
        const cartesian = this.viewer.scene.pickPosition(click.position);

        // 检查是否点击在有效位置
        if (!cartesian) {
          console.warn('点击位置无效');
          return;
        }

        // 第一次点击时初始化多边形
        if (activeShapePoints.length === 0) {
          activeShapePoints.push(cartesian);
          activeShape = this.createPolygon(activeShapePoints);
        }

        // 每次左键点击添加一个顶点
        activeShapePoints.push(cartesian);
        this.createPoint(cartesian);
      }
      if (pointType === 2) {
        // 鼠标正常情况点击事件
        // 获取点击的位置，屏幕坐标转为世界坐标
        // const ray = this.viewer.camera.getPickRay(click.position);
        // const pickedEntity = this.viewer.scene.pickFromRay(ray);
        // 使用 scene.pick 来获取被点击的实体，而不仅仅是通过射线
        const ray = this.viewer.camera.getPickRay(click.position);
        cartesian1 = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        const windowPosition =
          this.viewer.scene.cartesianToCanvasCoordinates(cartesian1);

        const pickedEntity = this.viewer.scene.pick(click.position);
        console.log('pickedEntity', pickedEntity);
        if (
          Cesium.defined(pickedEntity) &&
          pickedEntity.id &&
          pickedEntity.id?.myInfo
        ) {
          console.log(
            '点击实体',
            pickedEntity.id.id,
            pickedEntity.primitive.position,
          );
          // 保存当前点击的实体
          currentEntity = pickedEntity;
          const entity = pickedEntity.id; // 获取点击的实体
          // 删除现有的弹框（如果有的话）
          const existingInfoBox = document.querySelector('#custom-info-box-id');
          if (existingInfoBox) {
            existingInfoBox.remove(); // 移除已存在的弹框
          }
          this.showCustomInfoBox(pickedEntity.id, pickedEntity.primitive); // 展示自定义 InfoBox
          // 判断点击的是不是 billboard 类型的实体
          // if (entity.primitive === ) {
          //   console.log('点击广告牌');
          // }
        } else {
          currentEntity = null;
          const existingInfoBox = document.querySelector('#custom-info-box-id');
          if (existingInfoBox) {
            existingInfoBox.remove(); // 移除已存在的弹框
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 鼠标移动事件：动态调整最后一个顶点的位置
    this.viewer.screenSpaceEventHandler.setInputAction((movement) => {
      if (this.pointType === 1) {
        if (activeShapePoints.length === 0) return;

        const cartesian = this.viewer.scene.pickPosition(movement.endPosition);

        if (!cartesian) return;

        // 动态更新最后一个点的位置
        if (activeShapePoints.length > 1) {
          activeShapePoints.pop(); // 移除最后一个动态点
        }
        activeShapePoints.push(cartesian); // 添加新的动态点
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 鼠标右键点击事件：完成多边形绘制
    this.viewer.screenSpaceEventHandler.setInputAction(() => {
      if (this.pointType === 1 && activeShapePoints.length > 2) {
        // 去除最后一个动态点
        activeShapePoints.pop();

        // 创建完成的多边形
        finishedShape = this.createFinishedPolygon(activeShapePoints);
        if (this.callback) {
          // 假设 activeShapePoints 是笛卡尔坐标点的数组
          const points = [];

          // 遍历 activeShapePoints，转换每个点的笛卡尔坐标为地理坐标
          for (const cartesian of activeShapePoints) {
            // 将笛卡尔坐标转换为地理坐标
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude); // 转换为经度
            const latitude = Cesium.Math.toDegrees(cartographic.latitude); // 转换为纬度

            // 将经纬度保存到 points 数组中
            points.push({ lng: Number(longitude), lat: Number(latitude) });
          }

          // 调用回调方法并传递点位数据
          this.callback(points);
        }
        // 清空状态
        this.viewer.entities.remove(activeShape);
        activeShapePoints = [];
        activeShape = undefined;
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    // /models/building/scene.gltf
  }
  /**
   * 更改右键和中间键功能
   */
  #changeRightMiddle() {
    this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.MIDDLE_DRAG,
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
    ];
    this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
      {
        eventType: Cesium.CameraEventType.LEFT_DRAG,

        modifier: Cesium.KeyboardEventModifier.CTRL,
      },
      {
        eventType: Cesium.CameraEventType.RIGHT_DRAG,

        modifier: Cesium.KeyboardEventModifier.CTRL,
      },
    ];
  }
  /**
   * 使用天地图
   */
  #useTianditu() {
    // 添加瓦片图层
    const tdt_key = '84b093e070c6c8ee2deaa489043f1ec8';
    const img_tdt = new Cesium.WebMapTileServiceImageryProvider({
      url: `https://{s}.tianditu.com/img_w/wmts?tk=${tdt_key}`,
      layer: 'vec',
      style: 'default',
      tileMatrixSetID: 'w',
      format: 'tiles',
      maximumLevel: 20,
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    });
    const img_cia = new Cesium.WebMapTileServiceImageryProvider({
      url: `https://{s}.tianditu.gov.cn/cva_w/wmts?tk=${tdt_key}`,
      layer: 'cva',
      style: 'default',
      tileMatrixSetID: 'w',
      format: 'tiles',
      maximumLevel: 10,
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    });
    const layers = this.viewer.scene.imageryLayers;
    layers.addImageryProvider(img_tdt);
    layers.addImageryProvider(img_cia);
  }
  // 绘制完成后的多边形
  createFinishedPolygon(points) {
    return this.viewer.entities.add({
      polygon: {
        hierarchy: points,
        material: Cesium.Color.GREEN.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK,
      },
    });
  }

  /**
   * 创建模型
   * @param {*} url  模型路径
   * @param {*} height  模型高度
   */
  createModel(url, height) {
    this.viewer.entities.removeAll();

    const position = Cesium.Cartesian3.fromDegrees(
      116.397_428,
      39.909_23,
      height,
    );
    const heading = Cesium.Math.toRadians(135);
    const pitch = 0;
    const roll = 0;
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr,
    );

    const entity = this.viewer.entities.add({
      name: url,
      position,
      orientation,
      model: {
        uri: url,
        minimumPixelSize: 128,
        maximumScale: 20_000,
      },
    });
    // this.viewer.trackedEntity = entity;
  }

  // 添加点实体
  createPoint(worldPosition) {
    return this.viewer.entities.add({
      position: worldPosition,
      point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
      },
    });
  }
  // 绘制动态多边形
  createPolygon(points) {
    return this.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.CallbackProperty(() => {
          return new Cesium.PolygonHierarchy(points);
        }, false),
        material: Cesium.Color.RED.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK,
      },
    });
  }
  // flyto指定位置
  flytoPoint(point) {
    const [longitude, latitude] = point.lonlat.split(',').map(Number);
    // 根据经纬度地图添加大头针图片
    const height = 1000;
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
      orientation: {
        heading: Cesium.Math.toRadians(0), // 方向
        pitch: Cesium.Math.toRadians(-90), // 倾斜角度
        roll: 0, // 翻滚角度
      },
    });
    this.viewer.entities.removeAll();
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
      billboard: {
        image:
          'https://kdimage20200722.oss-cn-shenzhen.aliyuncs.com/kdimage20200722/root/projecthelper/2566dd2d7ec54fd2a587b1589986c558.png', // 指定图标
        width: 32, // 设置图标的宽度
        height: 32, // 设置图标的高度
      },
    });
  }

  /**
   * 设置 objType 和回调方法
   * @param {number} objType 点位类型：0 - 点，1 - 多边形
   * @param {Function} callback 回调函数，用于返回经纬度
   */
  setCallback(objType, callback) {
    this.pointType = objType;
    this.callback = callback;
  }
  // 创建自定义弹框函数
  showCustomInfoBox(entity, primitive) {
    const viewerContainer = this.viewer.container; // 获取 Cesium 容器

    // 创建一个新的 HTML 弹框元素
    const customInfoBox = document.createElement('div');
    customInfoBox.className = 'custom-info-box'; // 自定义样式类
    customInfoBox.id = 'custom-info-box-id';
    customInfoBox.style.position = 'absolute';
    customInfoBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    customInfoBox.style.color = 'white';
    customInfoBox.style.padding = '10px';
    customInfoBox.style.borderRadius = '5px';
    customInfoBox.style.maxWidth = '250px';

    // 弹框内容（可以自定义）
    const entityName = entity.id;
    console.log('entityName', entityName);
    customInfoBox.innerHTML = `
  <h4>${entityName}</h4>
  <p>物体信息:</p>
  <ul>
    <li>经度: ${Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(primitive.position).longitude)}</li>
    <li>纬度: ${Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(primitive.position).latitude)}</li>
  </ul>
`;

    // 添加弹框到页面中
    viewerContainer.append(customInfoBox);
    this.viewer.scene.postRender.addEventListener(
      this.updatePosition.bind(this),
    );
  }
  updatePosition() {
    if (!currentEntity) return; // 如果没有点击任何实体，则不更新
    // 将WGS84坐标中的位置转换为窗口坐标
    const windowPosition =
      this.viewer.scene.cartesianToCanvasCoordinates(cartesian1);
    // 数值是样式中定义的宽高
    if (windowPosition == undefined) return;
    document.querySelector('#custom-info-box-id').style.left =
      `${windowPosition.x - 220 / 2}px`;
    document.querySelector('#custom-info-box-id').style.top =
      `${windowPosition.y - 150}px`;
  }
}
