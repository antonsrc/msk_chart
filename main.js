"use strict"

const DATA = [
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

const arrSkill = getAllSkill(DATA);
const arrPro = getAllPro(DATA);

const mainSVG = document.getElementById('mainSVG');
const skillCircle = document.getElementById("skillCircle");
const proCircle = document.getElementById("proCircle");

const degStepSkill = 360/arrSkill.length;
const skillDotParams = {
    'cx': +skillCircle.getAttribute("cx"),
    'cy': +skillCircle.getAttribute("cy"),
    'r': +skillCircle.getAttribute("r")
};

const degStepPro = 360/arrPro.length;
const proDotParams = {
    'cx': +proCircle.getAttribute("cx"),
    'cy': +proCircle.getAttribute("cy"),
    'r': +proCircle.getAttribute("r")
};

const arrElementsForRemoving = [
    "skillRing",
    "proRing",
    "rectPro",
    "pathCurve"
];

const objPathSkill = {};
const objPathPro = {};

for (let i = -90, j = 0; i < 270; i += degStepSkill, j++) {
    addDot("Skill", skillDotParams, 14, arrSkill, j, i, 60);
    objPathSkill['groupSkill_'+j] = getPos(i, skillDotParams);
}

for (let i = -90, j = 0; i < 270; i += degStepPro, j++) {
    addDot("Pro", proDotParams, 12, arrPro, j, i, 73);
    objPathPro['groupPro_'+j] = getPos(i, proDotParams);
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".dotPro, .dotSkill").forEach(item => {
        item.addEventListener('click', e => {
            document.querySelectorAll("[class$='_selected']").forEach(item => {               
                let targetSelectedClass = item.getAttribute("class");

                const skillRing = document.getElementById("skillRing");
                const proRing = document.getElementById("proRing");
                const rectPro = document.getElementById("rectPro");
                const pathCurve = document.getElementById("pathCurve");

                if (targetSelectedClass == "dotSkill_selected") {
                    item.setAttribute("class", "dotSkill");
                } else if (targetSelectedClass == "dotPro_selected") {
                    item.setAttribute("class", "dotPro");
                } else if (targetSelectedClass == "textPro_selected") {
                    item.setAttribute("class", "textPro");
                } else if (targetSelectedClass == "textSkill_selected") {
                    item.setAttribute("class", "textSkill");
                }

                if (document.body.contains(skillRing)) {
                    skillRing.remove();
                } else if (document.body.contains(proRing)) {
                    proRing.remove();
                } else if (document.body.contains(rectPro)) {
                    rectPro.remove();
                }
                if (document.body.contains(pathCurve)) {
                    pathCurve.remove();
                } 

                // removeLastEvents(arrElementsForRemoving);
            });

            let targetGroup = e.target.parentNode;
            let targetDot = e.target;
            let targetText = document.querySelector(`#${targetGroup.id} div`);
            let targetTextContent = targetText.textContent;

            let xRing = +targetDot.getAttribute("cx");
            let yRing = +targetDot.getAttribute("cy");

            // SELECT SKILL
            if (targetDot.getAttribute("class") == "dotSkill") {
                targetDot.setAttribute("class", "dotSkill_selected");
                targetText.setAttribute("class", "textSkill_selected");
                addRing(xRing, yRing, 14, "skillRing");

                let selectedPro = [];
                // Добавляем в массив selectedPro те Профессии которые работают с определенным Навыком
                DATA.forEach(item => {
                    if (item['mainSkill'].includes(targetTextContent)) {
                        selectedPro.push(item.name);
                    }
                    if (item['otherSkill'].includes(targetTextContent)) {
                        selectedPro.push(item.name);
                    }
                });
                
                // Получим близжайшие точки, узнаем их группы и какой в этих группах текст
                let nearestDots = getNearestDots(targetDot).slice(0, selectedPro.length);
                let nearestGroups = {};
                nearestDots.forEach(item => {
                    nearestGroups[document.querySelector(`#${item[1]} div`).textContent] = item[1];
                });

                // Найдем Навыки и занесем их во временный объект {Навык: idГруппы}
                let proIdGroup = {};
                selectedPro.forEach(item => {
                    document.querySelectorAll(".textPro").forEach(i => {
                        if(i.textContent == item) {
                            let groupSkill = i.closest("g");
                            proIdGroup[i.textContent] = groupSkill.id;
                        }
                    });
                });

                let nearestGroupsArrBefore = Object.entries(nearestGroups);

                // Удаляем дубликаты, чтоб не было лишних перемещений
                for (let key in proIdGroup) {
                    if(key in nearestGroups) {
                        delete nearestGroups[key];
                        delete proIdGroup[key];
                    }
                }

                // Меняем местами текст
                let nearestGroupsArr = Object.entries(nearestGroups);
                let proIdGroupArr = Object.entries(proIdGroup);
                for(let i = 0; i < proIdGroupArr.length; i++) {
                    let temp = nearestGroupsArr[i][0];
                    nearestGroupsArr[i][0] = proIdGroupArr[i][0];
                    proIdGroupArr[i][0] = temp;

                    let wN = +document.querySelector(`#${nearestGroupsArr[i][1]} foreignObject`).getAttribute("width");
                    let hN = +document.querySelector(`#${nearestGroupsArr[i][1]} foreignObject`).getAttribute("height");
                    let tempW = wN;
                    let tempH = hN;

                    let wS = +document.querySelector(`#${proIdGroupArr[i][1]} foreignObject`).getAttribute("width");
                    let hS = +document.querySelector(`#${proIdGroupArr[i][1]} foreignObject`).getAttribute("height");

                    document.querySelector(`#${nearestGroupsArr[i][1]} foreignObject`).setAttribute("width", wS);
                    document.querySelector(`#${nearestGroupsArr[i][1]} foreignObject`).setAttribute("height", hS);

                    document.querySelector(`#${proIdGroupArr[i][1]} foreignObject`).setAttribute("width", tempW);
                    document.querySelector(`#${proIdGroupArr[i][1]} foreignObject`).setAttribute("height", tempH);

                    document.querySelector(`#${nearestGroupsArr[i][1]} div`).textContent = nearestGroupsArr[i][0];
                    document.querySelector(`#${proIdGroupArr[i][1]} div`).textContent = proIdGroupArr[i][0];
                }

                // Массивы для формирования ПУТЕЙ
                let x1 = [];
                let y1 = [];
                let namesPro = [];

                // Выделим эти Профессии
                nearestGroupsArrBefore.forEach(i => {
                    document.querySelector(`#${i[1]} circle`).setAttribute("class", "dotPro_selected");
                    document.querySelector(`#${i[1]} div`).setAttribute("class", "textPro_selected");

                    x1.push(+document.querySelector(`#${i[1]} circle`).getAttribute("cx"));
                    y1.push(+document.querySelector(`#${i[1]} circle`).getAttribute("cy"));
                    namesPro.push(document.querySelector(`#${i[1]} div`).textContent);

                });

                // Здесь прокладываем ПУТИ
                // 1 Имеем Базовый узел x0y0 и набор точек
                // Первая точка из набора составляет второй конец Базового отрезка
                let x0 = xRing;
                let y0 = yRing;

                // 2 Найдем углы полученные между Базовой линией и всеми другими линиями
                // которые из массивов x1 y1
                let arr_Ang = [];
                for (let i = 0; i < x1.length; i++) {
                    arr_Ang.push(getAlpha(x0, y0, x1[0], y1[0], x1[i], y1[i]));
                }

                // 3 Имея эти углы и Базовую линию, проверим, вернуться ли преждние координаты
                let arr_Coord = [];
                for (let i = 0; i < arr_Ang.length; i++) {
                    let [x, y] = getCoordCtrlPoint(x0, y0, x1[0], y1[0], arr_Ang[i]);
                    arr_Coord.push([x, y]);
                }

                // 4 Получим ПРАВИЛЬНЫЙ знак угла (через уравнение прямой проходящ через 2 точки)
                let arrDegSign = getArrWithDegSign(arr_Coord, x0, y0, x1, y1);

                let arrPathClass = [];
                namesPro.forEach(item => {
                    for (let i = 0; i < DATA.length; i++) {
                        if (DATA[i].name == item) {
                            if (DATA[i].mainSkill.includes(targetText.textContent)) {
                                arrPathClass.push('path');
                            } else if (DATA[i].otherSkill.includes(targetText.textContent)) {
                                arrPathClass.push('pathOther');
                            }
                        }
                        
                    }
                });

                // 5 Теперь, зная угол, можно знать в какую сторону отсчитывать угол
                // большой управляющей точки для кривой Безье

                // Построим кривые
                for (let i = 0; i < arrDegSign.length; i++) {
                    // Рычаг размером 3/4 от отрезка
                    let BCx = (x0 + x1[i]*3)/4;
                    let BCy = (y0 + y1[i]*3)/4;
                    // Рычажок раземром 1/4 от отрезка
                    let LCx = (x0 + BCx)/2;
                    let LCy = (y0 + BCy)/2;

                    let degL = 5;
                    let degB = 5 + 13*i;
                    let [litCx, litCy] = getCoordCtrlPoint(x0, y0, LCx, LCy, degL*arrDegSign[i]*(-1));
                    let [bigCx, bigCy] = getCoordCtrlPoint(x0, y0, BCx, BCy, degB*arrDegSign[i]);

                    addPath(x0, y0, litCx, litCy, bigCx, bigCy, x1[i], y1[i], arrPathClass[i]);
                }
            }

            // SELECT PRO
            if (targetDot.getAttribute("class") == "dotPro") {
                targetDot.setAttribute("class", "dotPro_selected");
                addRing(xRing, yRing, 14, "proRing");

                let dx = 8;
                let dy = 8;
                let width = targetText.offsetWidth + dx;
                let height = targetText.offsetHeight + dy;
                let offset_x = dx/2;
                let offset_y = dy/2;
                let xRect = +targetText.parentNode.getAttribute("x") - offset_x;
                let yRect = +targetText.parentNode.getAttribute("y") - offset_y;
                addRect(xRect, yRect, width, height, 7, "rectPro");

                // Добавляем в массивы mainSkill и otherSkill те Навыки с которыми работает Профессия
                let mainSkill = [];
                let otherSkill = [];
                let pro = DATA.filter(obj => obj.name == targetTextContent)[0];
                mainSkill = pro['mainSkill']
                if (pro.hasOwnProperty('otherSkill')) {
                    otherSkill = pro['otherSkill'];
                }
 
                // Получим близжайшие точки, узнаем их группы и какой в этих группах текст
                let endArr = otherSkill.length + mainSkill.length;
                let nearestDots = getNearestDots(targetDot).slice(0, endArr);
                let nearestGroups = {};
                nearestDots.forEach(item => {
                    nearestGroups[document.querySelector(`#${item[1]} div`).textContent] = item[1];
                });

                // Найдем Навыки и занесем их во временный объект {Навык: idГруппы}
                let skillIdGroup = {};
                mainSkill.forEach(item => {
                    document.querySelectorAll(".textSkill").forEach(i => {
                        if (i.textContent == item) {
                            let groupPro = i.closest("g");
                            skillIdGroup[i.textContent] = groupPro.id;
                        }
                    });
                });
                otherSkill.forEach(item => {
                    document.querySelectorAll(".textSkill").forEach(i => {
                        if (i.textContent == item) {
                            let groupPro = i.closest("g");
                            skillIdGroup[i.textContent] = groupPro.id;
                        }
                    });
                });

                let nearestGroupsArrBefore = Object.entries(nearestGroups);

                // Удаляем дубликаты, чтоб не было лишних перемещений
                for (let key in skillIdGroup) {
                    if(key in nearestGroups) {
                        delete nearestGroups[key];
                        delete skillIdGroup[key];
                    }
                }
                
                // Поменять местами текста
                let nearestGroupsArr = Object.entries(nearestGroups);
                let skillIdGroupArr = Object.entries(skillIdGroup);
                for(let i = 0; i < skillIdGroupArr.length; i++) {
                    let temp = nearestGroupsArr[i][0];
                    nearestGroupsArr[i][0] = skillIdGroupArr[i][0];
                    skillIdGroupArr[i][0] = temp;
                    document.querySelector(`#${nearestGroupsArr[i][1]} div`).textContent = nearestGroupsArr[i][0];
                    document.querySelector(`#${skillIdGroupArr[i][1]} div`).textContent = skillIdGroupArr[i][0];
                }

                // Массивы для формирования ПУТЕЙ
                let x1 = [];
                let y1 = [];
                let namesPro = [];

                // Выделим эти Навыки
                nearestGroupsArrBefore.forEach(i => {
                    document.querySelector(`#${i[1]} circle`).setAttribute("class", "dotSkill_selected");
                    document.querySelector(`#${i[1]} div`).setAttribute("class", "textSkill_selected");
                
                    x1.push(+document.querySelector(`#${i[1]} circle`).getAttribute("cx"));
                    y1.push(+document.querySelector(`#${i[1]} circle`).getAttribute("cy"));
                    namesPro.push(document.querySelector(`#${i[1]} div`).textContent);

                }); 

                // Здесь прокладываем ПУТИ
                // 1 
                let x0 = xRing;
                let y0 = yRing;

                // 2 
                let arr_Ang = [];
                for (let i = 0; i < x1.length; i++) {
                    arr_Ang.push(getAlpha(x0, y0, x1[0], y1[0], x1[i], y1[i]));
                }

                // 3 
                let arr_Coord = [];
                for (let i = 0; i < arr_Ang.length; i++) {
                    let [x, y] = getCoordCtrlPoint(x0, y0, x1[0], y1[0], arr_Ang[i]);
                    arr_Coord.push([x, y]);
                }

                // 4
                let arrDegSign = getArrWithDegSign(arr_Coord, x0, y0, x1, y1)

                let arrPathClass = [];
                namesPro.forEach(item => {
                    for (let i = 0; i < DATA.length; i++) {
                        if (DATA[i].name == targetText.textContent) {
                            if (DATA[i].mainSkill.includes(item)) {
                                arrPathClass.push('path');
                            } else if (DATA[i].otherSkill.includes(item)) {
                                arrPathClass.push('pathOther');
                            }
                        }
                        
                    }
                });

                // 5 
                for (let i = 0; i < arrDegSign.length; i++) {
                    let BCx = (x0 + x1[i]*3)/4;
                    let BCy = (y0 + y1[i]*3)/4;
                    let LCx = (x0 + BCx)/2;
                    let LCy = (y0 + BCy)/2;

                    let degL = 2;
                    let degB = 5 + 2*i;
                    let [litCx, litCy] = getCoordCtrlPoint(x0, y0, LCx, LCy, degL*arrDegSign[i]*(-1));
                    let [bigCx, bigCy] = getCoordCtrlPoint(x0, y0, BCx, BCy, degB*arrDegSign[i]);

                    addPath(x0, y0, litCx, litCy, bigCx, bigCy, x1[i], y1[i], arrPathClass[i]);
                }
            }
        });
    });
});

function addDot(dotName, dotParams, dotSize, textData, i, deg, rShift) {
    let [x, y] = getPos(deg, dotParams);
    let [xText, yText] = getPos(deg, dotParams, rShift);
    let g = addGroup(`group${dotName}_${i}`, `g${dotName}`);
    addCircle(x, y, dotSize, `dot${dotName}`, g);
    addText(xText, yText, `text${dotName}`, textData[i], g);
}

function addRing(x, y, r, id) {
    let element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    element.setAttribute("cx", x);
    element.setAttribute("cy", y);
    element.setAttribute("r", r);
    element.setAttribute("id", id);
    proCircle.after(element);
}

function addRect(x, y, w, h, rx, id) {
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("rx", rx);
    rect.setAttribute("id", id);
    proCircle.after(rect);
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
    path.setAttribute("id", "pathCurve");
    proCircle.after(path);
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

function getAlpha(x0, y0, x1, y1, x1_new, y1_new) {
    let a1 = x1 - x0;
    let a2 = y1 - y0;
    let b1 = x1_new - x0;
    let b2 = y1_new - y0;
    let cosA = (a1*b1 + a2*b2)/(Math.sqrt(a1**2 + a2**2)*Math.sqrt(b1**2 + b2**2));
    return Math.acos(cosA)*180/Math.PI;
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

function getPos(deg, skillDotParams, rShift) {
    let rBig = skillDotParams['r'];
    let xBig = skillDotParams['cx'];
    let yBig = skillDotParams['cy'];

    if (rShift != undefined) {
        rBig += rShift;
    }

    let rad = deg2rad(deg);
    let x = xBig + rBig*Math.cos(rad);
    let y = yBig + rBig*Math.sin(rad);
    return [x, y];
}

function deg2rad(deg) {
    return deg*Math.PI/180;
}

function getAllPro(data) {
    let arr = [];
    DATA.forEach(item => arr.push(item.name));
    return arr;
}

function getAllSkill(data) {
    let allSkill = new Set();
    DATA.forEach(item => {
        let ms = new Set(item.mainSkill);
        let os = new Set(item.otherSkill);
        allSkill = new Set([...allSkill, ...ms, ...os]);
    });
    return Array.from(allSkill);
}

function getLength(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2));
}

function getNearestDots(selectedDot) {
    let xP = +selectedDot.getAttribute("cx");
    let yP = +selectedDot.getAttribute("cy");
    let lengthArr = [];
    if (selectedDot.getAttribute("class") == "dotSkill_selected") {
        for(let group in objPathPro) {
            let [xS, yS] = objPathPro[group];
            let len = getLength(xP, yP, xS, yS);
            lengthArr.push([len, group]);
        }
    } else if (selectedDot.getAttribute("class") == "dotPro_selected") {
        for(let group in objPathSkill) {
            let [xS, yS] = objPathSkill[group];
            let len = getLength(xP, yP, xS, yS);
            lengthArr.push([len, group]);
        }
    }
    lengthArr.sort((a, b) => a[0] - b[0]);
    return lengthArr;
}

function getArrWithDegSign(arr_Coord, x0, y0, x1, y1) {
    let arrDegSign = [];
    for (let i = 0; i < arr_Coord.length; i++) {
        let a1 = x1[i] - x0;
        let b1 = arr_Coord[i][0] - x0;
        let a2 = y1[i] - y0;
        let b2 = arr_Coord[i][1] - y0;

        if (b1 == 0) b1 = 0.01;
        if (b2 == 0) b2 = 0.01;
        if (a1 == 0) a1 = 0.01;
        if (a2 == 0) a2 = 0.01;

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

function removeLastEvents(arr) {
    arr.forEach(item => {
        let element = document.getElementById(item);
        if (document.body.contains(element)) {
            element.remove();
        }
    });
}