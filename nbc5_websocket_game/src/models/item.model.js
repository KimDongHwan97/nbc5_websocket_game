// 아이템 데이터를 객체에 {key: uuid, value: array} 형태로 저장
const items = {};

// 새로운 아이템 배열 생성
export const createItemCollection = (uuid) => {
  items[uuid] = [];
};

// uuid로 아이템 배열 가져오기
export const getItemCollection = (uuid) => {
  return items[uuid];
};

// 아이템 추가 (id와 스테이지 ID, 점수 초기화)
export const addItem = (uuid, id, stageId, timestamp) => {
  const itemInfo = itemData.find(item => item.id === id);
  if (itemInfo) {
    items[uuid].push({ 
      id, 
      stageId, 
      timestamp, 
      score: itemInfo.score || 0
    });
  }
};

// 특정 아이템의 점수를 추가
export const addItemScore = (uuid, id, additionalScore) => {
  const item = items[uuid].find((item) => item.id === id);
  if (item) {
    item.score += additionalScore;
  }
};

// 특정 UUID의 아이템 배열 초기화
export const clearItemCollection = (uuid) => {
  items[uuid] = [];
};

// 특정 스테이지에서 사용 가능한 아이템 필터링
export const getItemsByStage = (stageId) => {
  const stageUnlock = itemUnlockData.find((unlock) => unlock.stage_id === stageId);
  if (!stageUnlock) return [];
  return itemData.filter((item) => stageUnlock.item_id.includes(item.id));
};

// 특정 아이템이 특정 스테이지에서 유효한지 확인
export const isItemValidForStage = (stageId, itemId) => {
  const stageUnlock = itemUnlockData.find((unlock) => unlock.stage_id === stageId);
  return stageUnlock ? stageUnlock.item_id.includes(itemId) : false;
};
