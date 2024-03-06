"use strict"

const INPUT_DATA = [
    {
        name: "Финансовый аналитик",
        mainSkill: ["Excel", "SQL", "VBA", "1C"],
        otherSkill: ["Power BI", "Python"],
    },
    {
        name: "Предприниматель",
        mainSkill: ["1C", "Excel", "Power BI"],
        otherSkill: [
            "Google Analytics",
            "Яндекс.Метрика",
            "Python",
            "SQL",
            "Tilda",
        ],
    },
    {
        name: "Продуктовый дизайнер",
        mainSkill: [
            "Figma",
            "Sketch",
            "Illustrator",
            "Photoshop",
            "Principle",
            "Tilda",
        ],
        otherSkill: ["Shopify", "Protopie", "Cinema 4D"],
    },
    {
        name: "Менеджер проекта",
        mainSkill: [
            "Visio",
            "1C",
            "Google Analytics",
            "Яндекс.Метрика",
            "Python",
            "SQL",
            "Tilda",
        ],
        otherSkill: ["Figma", "Sketch", "Shopify"],
    },
    {
        name: "Финансовый менеджер",
        mainSkill: ["1C", "Excel", "Power BI"],
        otherSkill: ["BPMN"],
    },
    {
        name: "Руководитель финансового департамента компании",
        mainSkill: ["Sketch", "Figma"],
        otherSkill: ["Shopify", "HQL"],
    },
    {
        name: "Продуктовый аналитик",
        mainSkill: [
            "Google Analytics",
            "Яндекс.Метрика",
            "SQL",
            "Power BI",
            "Python",
            "Excel",
        ],
        otherSkill: ["HQL", "Tableau", "R", "Machine learning"],
    },
    {
        name: "Руководитель финансового продукта",
        mainSkill: ["Visio"],
        otherSkill: ["Python"],
    },
    {
        name: "Менеджер по маркетингу",
        mainSkill: [
            "Google Analytics",
            "Яндекс.Метрика",
            "Google Ads",
            "Ahrefs",
            "Главред",
            "My Target",
        ],
        otherSkill: ["Tilda", "Photoshop", "Xenu", "Python"],
    },
    {
        name: "Менеджер по цифровой трансформации",
        mainSkill: [
            "Visio",
            "Google Analytics",
            "Яндекс.Метрика",
            "Python",
            "SQL",
            "Tilda",
        ],
        otherSkill: ["Figma", "Sketch", "Shopify"],
    },
];

const mainSVG = document.getElementById("mainSVG");

const elementsForRemoving = [
    ".ringPro",
    ".rectPro",
    ".ringSkill",
    ".otherSkillPath",
    ".mainSkillPath"
];

let winWidth = window.innerWidth || window.clientWidth || window.clientWidth;
const ratio = (winWidth <= 700) ? 0.7 : 1;

const dotParams = {
    Skill: {
        size: 14 * ratio,
        ringSize: 18 * ratio,
        radiusTextShift: 60 * ratio,
        slave: "Pro",
    },
    Pro: {
        size: 12 * ratio,
        ringSize: 16 * ratio,
        radiusTextShift: 73 * ratio,
        slave: "Skill",
    },
};

const textParams = {
    textWidth: 100 * ratio,
    textHeight: 14 * ratio,
    fontSize: 10.6667 * ratio,
};

const pathParams = {
    strokeWidth: 2.5 * ratio,
};

const bigCircleParams = {
    strokeWidth: 3 * ratio,
};

const maxPathRange = 500;


window.addEventListener("load", () => {
    addBigCircle(400, 400, 290 * ratio, 'circleSkill');
    addBigCircle(400, 400, 125 * ratio, 'circlePro');

    addDotsAtCircle(getAllSkill, "Skill");
    addDotsAtCircle(getAllPro, "Pro");

    mainSVG.addEventListener("click", e => {
        let dot = e.target;
        if (!isDot(dot)) return;

        removePreviousEvents(elementsForRemoving);
        unselectAll();
        highlightDot(dot);
        changeTextArea(dot);
        addAllPaths(dot);
    });
});

function addDot(dotName, textData, deg) {
    const circle = document.getElementById(`circle${dotName}`);
    const circleParams = {
        cx: +circle.getAttribute("cx"),
        cy: +circle.getAttribute("cy"),
        r: +circle.getAttribute("r")
    };
    const { size, radiusTextShift } = dotParams[dotName];

    let g = addGroup(`group${dotName}_${deg}`, `g${dotName}`);

    let [x, y] = getPos(deg, circleParams);
    addCircle(x, y, size, `dot${dotName}`, g);

    let [xText, yText] = getPos(deg, circleParams, radiusTextShift);
    addText(xText, yText, `text${dotName}`, textData, g);
}

function addRing(dot) {
    let element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    let { dotX, dotY, dotType } = getDotParams(dot);
    element.setAttribute("cx", dotX);
    element.setAttribute("cy", dotY);
    element.setAttribute("class", `ring${dotType}`);
    dot.before(element);
}

function addRect(arr, rx, class_name) {
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    let [x, y, w, h] = arr;
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("rx", rx);
    rect.setAttribute("class", class_name);
    mainSVG.prepend(rect);
}

function addGroup(id, class_name) {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", id);
    g.setAttribute("class", class_name);
    mainSVG.append(g);
    return g;
}

function addCircle(x, y, r, class_name, group) {
    let element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    element.setAttribute("cx", x);
    element.setAttribute("cy", y);
    element.setAttribute("r", r);
    element.setAttribute("class", class_name);
    group.append(element);
}

function addPath(x0, y0, xc1, yc1, xc2, yc2, x1, y1, class_name, maxRange) {
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d = `M ${x0} ${y0} C ${xc1} ${yc1} ${xc2} ${yc2} ${x1} ${y1}`;
    path.setAttribute("d", d);
    path.setAttribute("class", class_name);
    path.setAttribute("stroke-width", pathParams.strokeWidth);
    path.setAttribute("stroke-dashoffset", maxRange);
    mainSVG.prepend(path);
}

function getCoordCtrlPoint(x0, y0, x1, y1, deg) {
    let x1_shift = x1 - x0;
    let y1_shift = y1 - y0;
    let rad = deg * Math.PI / 180;
    let x_new_shift = x1_shift * Math.cos(rad) - y1_shift * Math.sin(rad);
    let y_new_shift = x1_shift * Math.sin(rad) + y1_shift * Math.cos(rad);
    let x_new = x_new_shift + x0;
    let y_new = y_new_shift + y0;
    return [x_new, y_new];
}

function getDeg(x0, y0, x1, y1, x1_new, y1_new) {
    let a1 = x1 - x0;
    let a2 = y1 - y0;
    let b1 = x1_new - x0;
    let b2 = y1_new - y0;
    let cosA = (a1 * b1 + a2 * b2) / (Math.sqrt(a1 ** 2 + a2 ** 2) * Math.sqrt(b1 ** 2 + b2 ** 2));
    return isNaN(Math.acos(cosA) * 180 / Math.PI) ? 0 : Math.acos(cosA) * 180 / Math.PI;
}

function addText(x, y, class_name, content, g) {
    let text = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    let contents = content.split(" ");
    let height = contents.length * textParams["textHeight"];

    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("width", textParams["textWidth"]);
    text.setAttribute("height", height);
    g.append(text);

    let div = document.createElement("div");
    div.setAttribute("class", class_name);
    div.style.fontSize = textParams["fontSize"] + "px";
    div.textContent = content;
    text.append(div);

    let offset_x = text.getBBox().width / 2;
    let offset_y = text.getBBox().height / 2;
    text.setAttribute("x", x - offset_x);
    text.setAttribute("y", y - offset_y);
}

function getPos(deg, circleParams, radiusTextShift) {
    let { cx, cy, r } = circleParams;
    r = (radiusTextShift !== undefined) ? r += radiusTextShift : r;
    let rad = deg2rad(deg);
    let x = cx + r * Math.cos(rad);
    let y = cy + r * Math.sin(rad);
    return [x, y];
}

function deg2rad(deg) {
    return deg * Math.PI / 180;
}

function getAllPro(data) {
    return data.map(item => item.name);
}

function getAllSkill(data) {
    let allSkill = new Set();
    for (const item of data) {
        let ms = new Set(item.mainSkill);
        let os = new Set(item.otherSkill);
        allSkill = new Set([...allSkill, ...ms, ...os]);
    }
    return Array.from(allSkill);
}

function getLength(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function nearestSlaveDots(dot, amount) {
    let { dotX, dotY, dotType } = getDotParams(dot);
    let lengthPaths = [];
    let dotCoord = getCoords(`.g${dotParams[dotType].slave}`);
    for (let group in dotCoord) {
        let [xS, yS] = dotCoord[group];
        let len = getLength(dotX, dotY, xS, yS);
        lengthPaths.push([len, group]);
    }

    lengthPaths.sort((a, b) => a[0] - b[0]);
    let groupNames = lengthPaths.map(i => i[1]);

    let slaveGroupsNearest = {};
    for (const item of groupNames.slice(0, amount)) {
        let text = document.querySelector(`#${item} div`).textContent;
        slaveGroupsNearest[text] = item;
    }
    return slaveGroupsNearest;
}

function getDegSigns(coords, x0, y0, x1, y1) {
    return coords.map((coord, i) => {
        let a1 = x1[i] - x0;
        let b1 = coord[0] - x0;
        let a2 = y1[i] - y0;
        let b2 = coord[1] - y0;
        let ab1 = (a1 / b1).toFixed(2);
        let ab2 = (a2 / b2).toFixed(2);
        if (ab1 == ab2) {
            return 1;
        } else {
            return -1;
        }
    });
}

function removePreviousEvents(arr) {
    for (const item of arr) {
        document.querySelectorAll(item).forEach(i => i.remove());
    }
}

function unselectAll() {
    for (const item of document.querySelectorAll("[class$='_selected']")) {
        item.setAttribute("class", item.getAttribute("class").slice(0, -9));
    }
}

function getSlaveProDots(dot) {
    let arr = [];
    let { text } = getDotParams(dot);
    for (const item of INPUT_DATA) {
        if (item["mainSkill"].includes(text)) {
            arr.push(item.name);
        }
        if (item.hasOwnProperty("otherSkill") && item["otherSkill"].includes(text)) {
            arr.push(item.name);
        }
    }
    return arr;
}

function getSlaveSkillDots(dot) {
    let arr = [];
    let { text } = getDotParams(dot);
    let pro = INPUT_DATA.filter(obj => obj.name == text)[0];
    if (pro.hasOwnProperty("otherSkill")) {
        arr = pro["mainSkill"].concat(pro["otherSkill"]);
    } else {
        arr = pro["mainSkill"];
    }
    return arr;
}

function getRectCoord(text) {
    let dx = 8;
    let dy = 8;
    let width = text.offsetWidth + dx;
    let height = text.offsetHeight + dy;
    let offset_x = dx / 2;
    let offset_y = dy / 2;
    let xRect = +text.parentNode.getAttribute("x") - offset_x;
    let yRect = +text.parentNode.getAttribute("y") - offset_y;
    return [xRect, yRect, width, height];
}

function removeDuplicateKeys(obj1, obj2) {
    let obj1Filtered = structuredClone(obj1);
    let obj2Filtered = structuredClone(obj2);
    for (let key in obj1Filtered) {
        if (key in obj2Filtered) {
            delete obj2Filtered[key];
            delete obj1Filtered[key];
        }
    }
    return [obj1Filtered, obj2Filtered];
}

function getObjOfContentToGroupId(arr, selector) {
    let slaveGroups = {};
    for (const i of document.querySelectorAll(`.text${selector}`)) {
        if (arr.includes(i.textContent)) {
            let group = i.closest("g");
            slaveGroups[i.textContent] = group.id;
        }
    }
    return slaveGroups;
}

function replaceContent(i, arr1, arr2) {
    let temp = arr1[i][0];
    arr1[i][0] = arr2[i][0];
    arr2[i][0] = temp;

    let foreignElemNearest = document.querySelector(`#${arr1[i][1]} foreignObject`);
    let foreignElem = document.querySelector(`#${arr2[i][1]} foreignObject`);
    foreignElemNearest.firstChild.textContent = arr1[i][0];
    foreignElem.firstChild.textContent = arr2[i][0];
}

function replaceContentParams(i, arr1, arr2) {
    let foreignElemNearest = document.querySelector(`#${arr1[i][1]} foreignObject`);
    let foreignElem = document.querySelector(`#${arr2[i][1]} foreignObject`);

    let tempW = +foreignElemNearest.getAttribute("width");
    let tempH = +foreignElemNearest.getAttribute("height");
    let wS = +foreignElem.getAttribute("width");
    let hS = +foreignElem.getAttribute("height");

    foreignElemNearest.setAttribute("width", wS);
    foreignElemNearest.setAttribute("height", hS);
    foreignElem.setAttribute("width", tempW);
    foreignElem.setAttribute("height", tempH);
}

function moveContent(dot, slaveDotType) {
    let textOfSlaveDots = (slaveDotType == "Pro") ? getSlaveProDots(dot) : getSlaveSkillDots(dot);
    let slaveGroups = getObjOfContentToGroupId(textOfSlaveDots, slaveDotType);
    let slaveGroupsNearest = nearestSlaveDots(dot, textOfSlaveDots.length);
    let [slaveGroupsFiltered, slaveGroupsNearestFiltered] = removeDuplicateKeys(slaveGroups, slaveGroupsNearest);

    let slaveGroupsNearestArr = Object.entries(slaveGroupsNearestFiltered);
    let slaveGroupsArr = Object.entries(slaveGroupsFiltered);

    for (let i = 0; i < slaveGroupsArr.length; i++) {
        replaceContent(i, slaveGroupsNearestArr, slaveGroupsArr);
        if (slaveDotType == "Pro") {
            replaceContentParams(i, slaveGroupsNearestArr, slaveGroupsArr);
        }
    }
    return Object.values(slaveGroupsNearest);
}

function highlightSlaves(arr) {
    let x1 = [];
    let y1 = [];
    let names = [];
    for (const i of arr) {
        let dot = document.querySelector(`#${i} circle`);
        let { text, textElem, textClassName, dotClassName } = getDotParams(dot);

        dot.setAttribute("class", `${dotClassName}_selected`);
        textElem.setAttribute("class", `${textClassName}_selected`);

        x1.push(+dot.getAttribute("cx"));
        y1.push(+dot.getAttribute("cy"));
        names.push(text);
    }
    return [names, x1, y1];
}

function getPathParams(dot, x1, y1, namesSlaves) {
    let { textElem, dotX, dotY } = getDotParams(dot);
    // Найдем углы полученные между Базовой линией (dotX, dotY, x1[0], y1[0]) 
    // и всеми другими линиями которые из массивов x1 y1
    let degrees = namesSlaves.map((val, i) => getDeg(dotX, dotY, x1[0], y1[0], x1[i], y1[i]));

    // Имея углы degrees и Базовую линию получим координаты точек
    // которые должны лежать на прямых под углами degrees
    let coords = degrees.map(deg => getCoordCtrlPoint(dotX, dotY, x1[0], y1[0], deg));

    // Через уравнение прямой проходящ через 2 точки 
    // проверим лежат ли координаты точек coords на прямых
    let arrDegSign = getDegSigns(coords, dotX, dotY, x1, y1);

    // Опрделеим класс (цвет) кривой
    let arrPathClass = [];
    for (const item of namesSlaves) {
        let comparedVar;
        let inclVar;
        if (textElem.getAttribute("class") == "textSkill_selected") {
            comparedVar = item;
            inclVar = textElem.textContent;
        } else if (textElem.getAttribute("class") == "textPro") {
            comparedVar = textElem.textContent;
            inclVar = item;
        }

        for (const item of INPUT_DATA) {
            if (item.name == comparedVar) {
                if (item["mainSkill"].includes(inclVar)) {
                    arrPathClass.push("mainSkillPath");
                } else if (item["otherSkill"].includes(inclVar)) {
                    arrPathClass.push("otherSkillPath");
                }
                break;
            }
        }
    }
    return [arrDegSign, arrPathClass];
}

function addAllPaths(dot) {
    let { dotX, dotY, dotType } = getDotParams(dot);
    let slaveDotType = dotParams[dotType].slave;

    let nearestSlaveGroupsArr = moveContent(dot, slaveDotType);
    let [namesSlaves, x1, y1] = highlightSlaves(nearestSlaveGroupsArr);

    let [arrDegSign, arrPathClass] = getPathParams(dot, x1, y1, namesSlaves);

    for (let i = 0; i < arrDegSign.length; i++) {
        // Рычажок длинной 3/4 от отрезка
        let BCx = (dotX + x1[i] * 3) / 4;
        let BCy = (dotY + y1[i] * 3) / 4;
        // Рычажок длинной 1/4 от отрезка
        let LCx = (dotX + BCx) / 2;
        let LCy = (dotY + BCy) / 2;

        let degL;
        let degB;
        if (slaveDotType == "Pro") {
            degL = 5;
            degB = 5 + 13 * i;
        } else if (slaveDotType == "Skill") {
            degL = 2;
            degB = 5 + 2 * i;
        }

        let [litCx, litCy] = getCoordCtrlPoint(dotX, dotY, LCx, LCy, degL * arrDegSign[i] * (-1));
        let [bigCx, bigCy] = getCoordCtrlPoint(dotX, dotY, BCx, BCy, degB * arrDegSign[i]);
        addPath(dotX, dotY, litCx, litCy, bigCx, bigCy, x1[i], y1[i], arrPathClass[i], maxPathRange);
        animate(extendPath, 1000)
    }
}

function extendPath(progress) {
    for (const item of document.querySelectorAll("[class$='SkillPath']")) {
        item.setAttribute('stroke-dashoffset', maxPathRange - progress * maxPathRange);
    }
}

function getDotParams(dot) {
    let dotX = +dot.getAttribute("cx");
    let dotY = +dot.getAttribute("cy");
    let dotClassName = dot.getAttribute("class");

    let textElem = document.querySelector(`#${dot.parentNode.id} div`);
    let text = textElem.textContent;
    let textClassName = textElem.getAttribute("class");

    let groupElem = dot.parentNode;
    let groupIdName = groupElem.id;
    let groupClassName = groupElem.getAttribute("class");
    let dotType = groupClassName.slice(1);

    return {
        dotX,
        dotY,
        dotClassName,
        textElem,
        text,
        textClassName,
        groupElem,
        groupIdName,
        groupClassName,
        dotType
    };
}

function isDot(dot) {
    let d = dot.matches(".dotSkill")
        || dot.matches(".dotPro")
        || dot.matches(".dotSkill_selected")
        || dot.matches(".dotPro_selected");
    return d;
}

function changeTextArea(dot) {
    let { textElem, dotType } = getDotParams(dot);
    if (dotType == "Skill") {
        textElem.setAttribute("class", `text${dotType}_selected`);
    } else if (dotType == "Pro") {
        addRect(getRectCoord(textElem), 7, `rect${dotType}`);
    }
}

function addDotsAtCircle(fn, dotName) {
    let inputData = fn(INPUT_DATA);
    let degStep = 360 / inputData.length;
    let degrees = degreesWithStep(degStep);
    inputData.forEach((text, i) => addDot(dotName, text, degrees[i]));
}

function getCoords(groupName) {
    let coords = {};
    for (const item of document.querySelectorAll(groupName)) {
        let dot = document.querySelector(`#${item.id} circle`);
        let { dotX, dotY, groupIdName } = getDotParams(dot);
        coords[groupIdName] = [dotX, dotY];
    }
    return coords;
}

function degreesWithStep(step) {
    let degrees = [];
    for (let deg = -90; deg < 270; deg += step) {
        degrees.push(Math.trunc(deg))
    }
    return degrees
}

function highlightDot(dot) {
    let { dotType } = getDotParams(dot);
    dot.setAttribute("class", `dot${dotType}_selected`);

    addRing(dot);
    let ringParams = {
        elem: document.querySelector(`.ring${dotType}`),
        maxRadius: dotParams[dotType].ringSize,
    };
    animate(radiusScaleUp, 150, ringParams)
}

function addBigCircle(cx, cy, r, nameId) {
    let element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    element.setAttribute("cx", cx);
    element.setAttribute("cy", cy);
    element.setAttribute("r", r);
    element.setAttribute("stroke", "#ADADAD");
    element.setAttribute("stroke-width", bigCircleParams.strokeWidth);
    element.setAttribute("id", nameId);
    mainSVG.append(element);
}

function radiusScaleUp(progress, params) {
    let { elem, maxRadius } = params;
    elem.setAttribute(`r`, progress * maxRadius);
}

function animate(draw, duration, params) {
    let start = performance.now();
    requestAnimationFrame(function anim(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction < 0) timeFraction = 0;
        if (timeFraction > 1) timeFraction = 1;
        draw(timeFraction, params);
        if (timeFraction < 1) {
            requestAnimationFrame(anim);
        }
    });
}