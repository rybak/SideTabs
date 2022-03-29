var $ko0ks$react = require("react");

function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "arrWithReposition", () => $dec653fb90a2b8bf$export$b69036b3d091a16a);
$parcel$export(module.exports, "default", () => $dec653fb90a2b8bf$export$2e2bcd8739ae039);

const $dec653fb90a2b8bf$var$DRAG_SPEED = 150; //translation transform time in ms
function $dec653fb90a2b8bf$var$getElementYPosition(element) {
    return element.getBoundingClientRect().top + window.scrollY;
}
const $dec653fb90a2b8bf$export$b69036b3d091a16a = (arr, from, to)=>{
    const result = [
        ...arr
    ];
    const [removed] = result.splice(from, 1);
    result.splice(to, 0, removed);
    return result;
};
const $dec653fb90a2b8bf$var$DragAndDrop = ({ render: render , items: items , onDragEnd: onDragEnd , onDragStart: onDragStart  })=>{
    const [draggingInfo, setDraggingInfo] = $ko0ks$react.useState(null);
    const [dragElements, setDragElements] = $ko0ks$react.useState({});
    const [elementTranslations, setElementTranslations] = $ko0ks$react.useState({});
    const [DIFT, setDIFT] = $ko0ks$react.useState(null); // set while dragged item transitions to it's final position using CSS.
    const recalculateDraggingInfo = (draggingItemId, mouseElementOffset)=>{
        const getElementInitYFromIndex = (index)=>{
            const element = dragElements[items[index].id];
            const translation = elementTranslations[items[index].id] || 0;
            return $dec653fb90a2b8bf$var$getElementYPosition(element) - translation;
        };
        const getElementHeightFromIndex = (index)=>{
            const element = dragElements[items[index].id];
            return element.getBoundingClientRect().height;
        };
        const elementIndex = items.findIndex((item)=>item.id === draggingItemId
        );
        const startingPosition = getElementInitYFromIndex(elementIndex);
        const startingIndex = items.map(({ id: id  })=>id
        ).indexOf(draggingItemId);
        const gap = getElementInitYFromIndex(1) - (getElementInitYFromIndex(0) + getElementHeightFromIndex(0));
        const initialElementBounds = Object.fromEntries(items.map(({ id: id  }, index)=>[
                id,
                [
                    getElementInitYFromIndex(index),
                    getElementHeightFromIndex(index) + gap
                ], 
            ]
        ));
        getElementInitYFromIndex(items.length - 1), getElementHeightFromIndex(items.length - 1);
        setDraggingInfo({
            id: draggingItemId,
            mouseElementOffset: mouseElementOffset,
            startingIndex: startingIndex,
            restingPositionItemId: draggingItemId,
            lastMousePosition: startingPosition + mouseElementOffset,
            restingPosition: startingPosition,
            initialElementBounds: initialElementBounds,
            bottomPosition: getElementInitYFromIndex(items.length - 1) + getElementHeightFromIndex(items.length - 1) - getElementHeightFromIndex(elementIndex)
        });
    // handleNewMousePosition(initialMousePosition);
    };
    const dragBeginning = (event, item)=>{
        event.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
        if (items.length < 2) return;
        if (onDragStart) onDragStart();
        if (DIFT) {
            clearTimeout(DIFT.timeout);
            setDIFT(null);
        }
        recalculateDraggingInfo(item.id, event.pageY - $dec653fb90a2b8bf$var$getElementYPosition(dragElements[item.id]));
    };
    const handleNewMousePosition = (newMousePostion)=>{
        if (!draggingInfo) return;
        if (newMousePostion == draggingInfo.lastMousePosition) return;
        let dragInfoToSet = {
            ...draggingInfo,
            lastMousePosition: newMousePostion
        };
        const elementPosition = newMousePostion - draggingInfo.mouseElementOffset;
        const [closestPositionItemId] = Object.entries(draggingInfo.initialElementBounds).reduce((closest, [currentId, [currentPosition]])=>{
            const distance = Math.abs(elementPosition - currentPosition);
            return distance < closest[1] ? [
                currentId,
                distance
            ] : closest;
        }, [
            "",
            Infinity
        ]);
        let newElementTranslations = {
            ...elementTranslations
        }; // a new object must be created so as to trigger the rerender
        if (draggingInfo.restingPositionItemId != closestPositionItemId) {
            newElementTranslations = {};
            const [restingPosition] = draggingInfo.initialElementBounds[closestPositionItemId];
            dragInfoToSet = {
                ...dragInfoToSet,
                restingPositionItemId: closestPositionItemId,
                restingPosition: restingPosition
            };
            const restingPositionIndex = items.findIndex(({ id: id  })=>id === closestPositionItemId
            );
            const intermediateItems = restingPositionIndex > draggingInfo.startingIndex ? items.slice(draggingInfo.startingIndex + 1, restingPositionIndex + 1) : items.slice(restingPositionIndex, draggingInfo.startingIndex);
            const down = restingPositionIndex > draggingInfo.startingIndex;
            intermediateItems.forEach((item)=>{
                newElementTranslations[item.id] = (down ? -1 : 1) * draggingInfo.initialElementBounds[draggingInfo.id][1];
            });
        }
        //axis lock
        const top = draggingInfo.initialElementBounds[items[0].id][0];
        const bottom = draggingInfo.bottomPosition;
        const newElementPosition = Math.min(Math.max(elementPosition, top), bottom);
        newElementTranslations[draggingInfo.id] = newElementPosition - draggingInfo.initialElementBounds[draggingInfo.id][0];
        //
        setElementTranslations(newElementTranslations);
        setDraggingInfo(dragInfoToSet);
    };
    const dragEnding = ()=>{
        if (!draggingInfo) return;
        const element = dragElements[draggingInfo.id];
        const [previousTenetY, previousTenetHeight] = draggingInfo.initialElementBounds[draggingInfo.restingPositionItemId];
        const newPosition = elementTranslations[draggingInfo.id] < 0 ? previousTenetY : previousTenetY + previousTenetHeight - draggingInfo.initialElementBounds[draggingInfo.id][1];
        const newTranslateY = $dec653fb90a2b8bf$var$getElementYPosition(element) - newPosition;
        setDIFT({
            id: draggingInfo.id,
            timeout: setTimeout(()=>{
                setDIFT(null);
                element.style.transition = "";
            }, $dec653fb90a2b8bf$var$DRAG_SPEED),
            element: element,
            newTranslateY: newTranslateY
        });
        setDraggingInfo(null);
        onDragEnd(draggingInfo.startingIndex, items.findIndex(({ id: id  })=>id === draggingInfo.restingPositionItemId
        ));
        setElementTranslations({});
    };
    const handleNewMousePositionRef = $ko0ks$react.useRef(handleNewMousePosition);
    handleNewMousePositionRef.current = handleNewMousePosition;
    const dragEndingRef = $ko0ks$react.useRef(dragEnding);
    dragEndingRef.current = dragEnding;
    $ko0ks$react.useEffect(()=>{
        const handleDragMoving = (event)=>{
            event.preventDefault(); // Allows drop to occur instantly, rather than after a 0.5s delay (for some reason)
            handleNewMousePositionRef.current(event.pageY);
        };
        const handleDragEnd = ()=>dragEndingRef.current()
        ;
        document.addEventListener("dragover", handleDragMoving);
        document.addEventListener("dragend", handleDragEnd);
        return ()=>{
            document.removeEventListener("dragover", handleDragMoving);
            document.removeEventListener("dragend", handleDragEnd);
        };
    }, []);
    $ko0ks$react.useEffect(()=>{
        const itemIds = items.map((item)=>item.id
        );
        const newDragElements = {};
        Object.keys(dragElements).forEach((id)=>{
            if (id in itemIds) newDragElements[id] = dragElements[id];
        });
        setDragElements(newDragElements);
        if (DIFT) {
            const { id: id , element: element , newTranslateY: newTranslateY  } = DIFT;
            requestAnimationFrame(()=>{
                element.style.transform = `translateY(${newTranslateY}px)`;
                element.style.transition = "transform 0s";
                requestAnimationFrame(()=>{
                    element.style.transform = "";
                    element.style.transition = `transform ${$dec653fb90a2b8bf$var$DRAG_SPEED}ms`;
                });
            });
        }
        if (draggingInfo) recalculateDraggingInfo(draggingInfo?.id, draggingInfo?.mouseElementOffset);
    }, [
        items
    ]);
    const renderParameter = items.map((item)=>{
        let itemStyle = {};
        const elementIsDragging = draggingInfo?.id === item.id;
        if (draggingInfo && !elementIsDragging) itemStyle["transition"] = `transform ${$dec653fb90a2b8bf$var$DRAG_SPEED}ms`;
        if (item.id in elementTranslations) itemStyle["transform"] = `translateY(${elementTranslations[item.id]}px)`;
        return [
            item,
            {
                style: itemStyle,
                onDragStart: (event)=>dragBeginning(event, item)
                ,
                draggable: "true",
                ref: (instance)=>{
                    dragElements[item.id] = instance;
                }
            },
            elementIsDragging, 
        ];
    });
    return render(renderParameter);
};
var $dec653fb90a2b8bf$export$2e2bcd8739ae039 = $dec653fb90a2b8bf$var$DragAndDrop;


//# sourceMappingURL=main.js.map
