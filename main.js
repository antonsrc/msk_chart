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

const allSkill = getAllSkill(INPUT_DATA);
const allPro = getAllPro(INPUT_DATA);
const mainSVG = document.getElementById('mainSVG');
const elementsForRemoving = [
    ".ringPro",
    ".rectPro",
    ".ringSkill",
    ".otherSkillPath",
    ".mainSkillPath"
];

let dotSkillCoord = addDotsAtCircle(allSkill, 'Skill', 14, 60);
let dotProCoord = addDotsAtCircle(allPro, 'Pro', 12, 73);

window.addEventListener('load', () => {
    mainSVG.addEventListener('click', e => {
        let dot = e.target;
        if(!isDot(dot)) return;
        let [, , , , , , dotName] = getDotParams(dot);

        if(checkGroupOfDot(dot)) {
            removePreviousEvents(elementsForRemoving);
            unselectAll();
        } else return;
        
        dot.setAttribute("class", `dot${dotName}_selected`);
        changeTextArea(dot);
        addRing(dot, 14);
        addAllPaths(dot);
    });
});

function addDot(dotName, dotSize, textData, deg, rShift) {
    const circle = document.getElementById(`circle${dotName}`);
    const circleParams = {
        cx: +circle.getAttribute("cx"),
        cy: +circle.getAttribute("cy"),
        r: +circle.getAttribute("r")
    };

    let [x, y] = getPos(deg, circleParams);
    let [xText, yText] = getPos(deg, circleParams, rShift);
    let g = addGroup(`group${dotName}_${deg}`, `g${dotName}`);
    addCircle(x, y, dotSize, `dot${dotName}`, g);
    addText(xText, yText, `text${dotName}`, textData, g);
    return [x, y];
}

function addRing(dot, r) {
    let element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    let [ , x, y, , , , dotName] = getDotParams(dot);
    element.setAttribute("cx", x);
    element.setAttribute("cy", y);
    element.setAttribute("r", r);
    element.setAttribute("class", `ring${dotName}`);
    circlePro.after(element);
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
    circlePro.after(rect);
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

function addPath(x0, y0, xc1, yc1, xc2, yc2, x1, y1, class_name) {
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d = `M ${x0} ${y0} C ${xc1} ${yc1} ${xc2} ${yc2} ${x1} ${y1}`;
    path.setAttribute("d", d);
    path.setAttribute("class", class_name);
    circlePro.after(path);
}

function getCoordCtrlPoint(x0, y0, x1, y1, deg) {
    let x1_shift = x1 - x0;
    let y1_shift = y1 - y0;
    let rad = deg*Math.PI/180;
    let x_new_shift = x1_shift*Math.cos(rad) - y1_shift*Math.sin(rad);
    let y_new_shift = x1_shift*Math.sin(rad) + y1_shift*Math.cos(rad);
    let x_new = x_new_shift + x0;
    let y_new = y_new_shift + y0;
    return [x_new, y_new];
}

function getDeg(x0, y0, x1, y1, x1_new, y1_new) {
    let a1 = x1 - x0;
    let a2 = y1 - y0;
    let b1 = x1_new - x0;
    let b2 = y1_new - y0;
    let cosA = (a1*b1 + a2*b2)/(Math.sqrt(a1**2 + a2**2)*Math.sqrt(b1**2 + b2**2));
    return isNaN(Math.acos(cosA)*180/Math.PI) ? 0 : Math.acos(cosA)*180/Math.PI;
}

function addText(x, y, class_name, content, g) {
    let text = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    let arr_content = content.split(" ");
    let height = arr_content.length*14;
    
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("width", 100);
    text.setAttribute("height", height);
    g.append(text);
    
    let div = document.createElement('div');
    div.setAttribute("class", class_name);
    div.textContent = content;
    text.append(div);
    
    let offset_x = text.getBBox().width/2;
    let offset_y = text.getBBox().height/2;
    text.setAttribute("x", x-offset_x);
    text.setAttribute("y", y-offset_y);
}

function getPos(deg, circleParams, radiusShift) {
    let {cx, cy, r} = circleParams;

    if (radiusShift != undefined) {
        r += radiusShift;
    }

    let rad = deg2rad(deg);
    let x = cx + r*Math.cos(rad);
    let y = cy + r*Math.sin(rad);
    return [x, y];
}

function deg2rad(deg) {
    return deg*Math.PI/180;
}

function getAllPro(data) {
    return data.map(item => item.name);
}

function getAllSkill(data) {
    let allSkill = new Set();
    data.forEach(item => {
        let ms = new Set(item.mainSkill);
        let os = new Set(item.otherSkill);
        allSkill = new Set([...allSkill, ...ms, ...os]);
    });
    return Array.from(allSkill);
}

function getLength(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2));
}

function nearestSlaveDots(selectedDot, amount) {
    let xP = +selectedDot.getAttribute("cx");
    let yP = +selectedDot.getAttribute("cy");
    let lengthArr = [];
    if (selectedDot.getAttribute("class") == "dotSkill_selected") {
        for(let group in dotProCoord) {
            let [xS, yS] = dotProCoord[group];
            let len = getLength(xP, yP, xS, yS);
            lengthArr.push([len, group]);
        }
    } else if (selectedDot.getAttribute("class") == "dotPro_selected") {
        for(let group in dotSkillCoord) {
            let [xS, yS] = dotSkillCoord[group];
            let len = getLength(xP, yP, xS, yS);
            lengthArr.push([len, group]);
        }
    }
    lengthArr.sort((a, b) => a[0] - b[0]);
    let arrOfGropuNames = lengthArr.map(i => i[1]);

    let slaveGroupsNearest = {};
    arrOfGropuNames.slice(0, amount).forEach(item => {
        let text = document.querySelector(`#${item} div`).textContent;
        slaveGroupsNearest[text] = item;
    });

    return slaveGroupsNearest;
}

function getArrWithDegSign(arrCoord, x0, y0, x1, y1) {
    let arrDegSign = [];
    for (let i = 0; i < arrCoord.length; i++) {
        let a1 = x1[i] - x0;
        let b1 = arrCoord[i][0] - x0;
        let a2 = y1[i] - y0;
        let b2 = arrCoord[i][1] - y0;
        let ab1 = (a1/b1).toFixed(2);
        let ab2 = (a2/b2).toFixed(2);
        if (ab1 == ab2) {
            arrDegSign.push(1);
        } else {
            arrDegSign.push(-1);
        }
    }
    return arrDegSign;
}

function removePreviousEvents(arr) {
    arr.forEach(item => {
        document.querySelectorAll(item).forEach(i => i.remove());
    });
}

function unselectAll() {
    document.querySelectorAll("[class$='_selected']").forEach(item => {
        item.setAttribute("class", item.getAttribute("class").slice(0,-9));
    });
}

function checkGroupOfDot(dot) {
    let dotGroupClass = dot.parentNode.getAttribute("class");
    return (dotGroupClass == "gPro" || dotGroupClass == "gSkill") ? true : false;
}

function getArrOfProDots(dot) {
    let arr = [];
    let text = document.querySelector(`#${dot.parentNode.id} div`).textContent;
    INPUT_DATA.forEach(item => {
        if (item['mainSkill'].includes(text)) {
            arr.push(item.name);
        }
        if (item.hasOwnProperty('otherSkill') && item['otherSkill'].includes(text)) {
            arr.push(item.name);
        }
    });
    return arr;
}

function getRectCoord(text) {
    let dx = 8;
    let dy = 8;
    let width = text.offsetWidth + dx;
    let height = text.offsetHeight + dy;
    let offset_x = dx/2;
    let offset_y = dy/2;
    let xRect = +text.parentNode.getAttribute("x") - offset_x;
    let yRect = +text.parentNode.getAttribute("y") - offset_y;
    return [xRect, yRect, width, height];
}

function getArrOfSkillDots(dot) {
    let arr = [];
    let text = document.querySelector(`#${dot.parentNode.id} div`).textContent;
    let pro = INPUT_DATA.filter(obj => obj.name == text)[0];
    if (pro.hasOwnProperty('otherSkill')) {
        arr = pro['mainSkill'].concat(pro['otherSkill']);
    }
    return arr;
}

function removeDuplicateKeys(obj1, obj2) {
    let obj1Filtered = structuredClone(obj1);
    let obj2Filtered = structuredClone(obj2);
    for (let key in obj1Filtered) {
        if(key in obj2Filtered) {
            delete obj2Filtered[key];
            delete obj1Filtered[key];
        }
    }
    return [obj1Filtered, obj2Filtered];
}

function getObjOfContentToGroupId(arr, selector) {
    let slaveGroups = {};
    arr.forEach(item => {
        document.querySelectorAll(selector).forEach(i => {
            if(i.textContent == item) {
                let group = i.closest("g");
                slaveGroups[i.textContent] = group.id;
            }
        });
    });
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

function moveContent(dot, selector) {
    let textOfSlaveDotsArr = (selector == ".textPro") ? getArrOfProDots(dot) : getArrOfSkillDots(dot);
    let slaveGroups = getObjOfContentToGroupId(textOfSlaveDotsArr, selector);
    let slaveGroupsNearest = nearestSlaveDots(dot, textOfSlaveDotsArr.length);
    let [slaveGroupsFiltered, slaveGroupsNearestFiltered] = removeDuplicateKeys(slaveGroups, slaveGroupsNearest);

    let slaveGroupsNearestArr = Object.entries(slaveGroupsNearestFiltered);
    let slaveGroupsArr = Object.entries(slaveGroupsFiltered);
    if (selector == ".textPro") {
        for(let i = 0; i < slaveGroupsArr.length; i++) {
            replaceContent(i, slaveGroupsNearestArr, slaveGroupsArr);
            replaceContentParams(i, slaveGroupsNearestArr, slaveGroupsArr);
        }
    } else if (selector == ".textSkill") {
        for(let i = 0; i < slaveGroupsArr.length; i++) {
            replaceContent(i, slaveGroupsNearestArr, slaveGroupsArr);
        }
    }
    return Object.values(slaveGroupsNearest);
}

function highlightSlaves(arr) {
    let x1 = [];
    let y1 = [];
    let names = [];
    arr.forEach(i => {
        let dot = document.querySelector(`#${i} circle`);
        let text = document.querySelector(`#${i} div`);
        let dotClassName = dot.getAttribute("class");
        let textClassName = text.getAttribute("class");

        dot.setAttribute("class", `${dotClassName}_selected`);
        text.setAttribute("class", `${textClassName}_selected`);

        x1.push(+dot.getAttribute("cx"));
        y1.push(+dot.getAttribute("cy"));
        names.push(text.textContent);
    });
    return [names, x1, y1];
}

function getPathParams(dot, x1, y1, namesSlaves) {
    let [dotText, dotX, dotY] = getDotParams(dot);
    // Найдем углы полученные между Базовой линией (dotX, dotY, x1[0], y1[0]) 
    // и всеми другими линиями которые из массивов x1 y1
    let arrDeg = [];
    for (let i = 0; i < x1.length; i++) {
        arrDeg.push(getDeg(dotX, dotY, x1[0], y1[0], x1[i], y1[i]));
    }

    // Имея углы arrDeg и Базовую линию получим координаты точек
    // которые должны лежать на прямых под углами arrDeg
    let coords = arrDeg.map((val, i) => getCoordCtrlPoint(dotX, dotY, x1[0], y1[0], arrDeg[i]));

    // Через уравнение прямой проходящ через 2 точки 
    // проверим лежат ли координаты точек coords на прямых
    let arrDegSign = getArrWithDegSign(coords, dotX, dotY, x1, y1);

    // Опрделеим класс (цвет) кривой
    let arrPathClass = [];
    namesSlaves.forEach(item => {
        let comparedVar;
        let inclVar;
        if (dotText.getAttribute("class") == "textSkill_selected") {
            comparedVar = item;
            inclVar = dotText.textContent;
        } else if (dotText.getAttribute("class") == "textPro") {
            comparedVar = dotText.textContent;
            inclVar = item;
        }

        for (let i = 0; i < INPUT_DATA.length; i++) {
            if (INPUT_DATA[i].name == comparedVar) {
                if (INPUT_DATA[i]['mainSkill'].includes(inclVar)) {
                    arrPathClass.push('mainSkillPath');
                } else if (INPUT_DATA[i]['otherSkill'].includes(inclVar)) {
                    arrPathClass.push('otherSkillPath');
                }
                break;
            }
        }
    });
    return [arrDegSign, arrPathClass];
}

function addAllPaths(dot) {
    let [ , dotX, dotY, , , , dotName] = getDotParams(dot);
    let slaveSelector = (dotName === "Skill") ? ".textPro" : ".textSkill";

    let nearestSlaveGroupsArr = moveContent(dot, slaveSelector);
    let [namesSlaves, x1, y1] = highlightSlaves(nearestSlaveGroupsArr);

    let [arrDegSign, arrPathClass] = getPathParams(dot, x1, y1, namesSlaves);

    for (let i = 0; i < arrDegSign.length; i++) {
        // Рычажок длинной 3/4 от отрезка
        let BCx = (dotX + x1[i]*3)/4;
        let BCy = (dotY + y1[i]*3)/4;
        // Рычажок длинной 1/4 от отрезка
        let LCx = (dotX + BCx)/2;
        let LCy = (dotY + BCy)/2;

        let degL;
        let degB;
        if (slaveSelector == ".textPro") {
            degL = 5;
            degB = 5 + 13*i;
        } else if (slaveSelector == ".textSkill") {
            degL = 2;
            degB = 5 + 2*i;
        }

        let [litCx, litCy] = getCoordCtrlPoint(dotX, dotY, LCx, LCy, degL*arrDegSign[i]*(-1));
        let [bigCx, bigCy] = getCoordCtrlPoint(dotX, dotY, BCx, BCy, degB*arrDegSign[i]);
        addPath(dotX, dotY, litCx, litCy, bigCx, bigCy, x1[i], y1[i], arrPathClass[i]);
    }
}

function getDotParams(dot) {
    let text = document.querySelector(`#${dot.parentNode.id} div`);
    let x = +dot.getAttribute("cx");
    let y = +dot.getAttribute("cy");
    let dotClassName = dot.getAttribute("class");
    let groupIdName = dot.parentNode.id;
    let groupClassName = dot.parentNode.getAttribute("class");
    let simpleGroupName = dot.parentNode.getAttribute("class").slice(1);
    return [text, x, y, dotClassName, groupIdName, groupClassName, simpleGroupName];
}

function isDot(dot) {
    let d = dot.matches(".dotSkill") 
    || dot.matches(".dotPro") 
    || dot.matches(".dotSkill_selected") 
    || dot.matches(".dotPro_selected");
    return d;
}

function changeTextArea(dot) {
    let [dotText, , , , , , text] = getDotParams(dot);
    if (text == 'Skill') {
        dotText.setAttribute("class", `text${text}_selected`);
    } else if (text == 'Pro') {
        addRect(getRectCoord(dotText), 7, `rect${text}`);
    }
}

function addDotsAtCircle(inputData, dotName, dotSize, rShift) {
    let dotCoord = {};
    let degStepSkill = 360/inputData.length;

    let degrees = [];
    for (let deg = -90; deg < 270; deg += degStepSkill) {
        degrees.push(Math.trunc(deg))
    }
    
    inputData.forEach((dot, i) => {
        dotCoord[`group${dotName}_${degrees[i]}`] = addDot(dotName, dotSize, dot, degrees[i], rShift);
    });
    return dotCoord;
}