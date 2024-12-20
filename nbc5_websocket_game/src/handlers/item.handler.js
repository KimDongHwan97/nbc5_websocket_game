import { createItemCollection, getItemCollection, addItem, addItemScore, getItemsByStage, isItemValidForStage } from '../models/item.model.js';
import { getStage } from '../models/stage.model.js';

// 특정 사용자의 아이템 컬렉션 초기화
export const handleItemCollection = (userId) => {
  // 사용자 아이템 컬렉션 생성
  createItemCollection(userId);
  // 성공 응답 반환
  return { status: 'success', message: 'Item collection initialized' };
};

// 특정 사용자를 위한 아이템 추가 처리
export const addItemHandler = (userId, payload) => {
  // 사용자의 현재 스테이지 가져오기
  const currentStages = getStage(userId);
  
  // 사용자의 스테이지가 없으면 실패 응답 반환
  if (!currentStages || !currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 스테이지를 ID 순으로 정렬하고 가장 최신 스테이지 가져오기
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 현재 스테이지에서 아이템이 유효한지 검증
  if (!isItemValidForStage(currentStage.id, payload.itemId)) {
    return { status: 'fail', message: 'Item not valid for current stage' };
  }

  // 사용자의 아이템 컬렉션에 아이템 추가
  addItem(userId, payload.itemId, currentStage.id, Date.now());
  
  // 성공 응답 반환
  return { status: 'success', message: 'Item added successfully' };
};

// 특정 사용자의 아이템 점수 처리
export const scoreItemHandler = (userId, payload) => {
  // 사용자의 아이템 컬렉션 가져오기
  const items = getItemCollection(userId);
  
  // 아이템이 없으면 실패 응답 반환
  if (!items || !items.length) {
    return { status: 'fail', message: 'No items found for user' };
  }

  // 사용자 컬렉션에서 특정 아이템 찾기
  const item = items.find((item) => item.id === payload.itemId);
  if (!item) {
    return { status: 'fail', message: 'Item not found in user collection' };
  }

  // 아이템에 점수 추가
  addItemScore(userId, payload.itemId, payload.score);
  
  // 성공 응답 반환
  return { status: 'success', message: 'Score updated successfully' };
};

// 특정 사용자의 현재 스테이지에서 사용 가능한 아이템 가져오기
export const getAvailableItemsHandler = (userId, payload) => {
  // 사용자의 현재 스테이지 가져오기
  const currentStages = getStage(userId);
  
  // 사용자의 스테이지가 없으면 실패 응답 반환
  if (!currentStages || !currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 스테이지를 ID 순으로 정렬하고 가장 최신 스테이지 가져오기
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 현재 스테이지에서 사용 가능한 아이템 가져오기
  const availableItems = getItemsByStage(currentStage.id);
  
  // 성공 응답 반환
  return { status: 'success', data: availableItems };
};