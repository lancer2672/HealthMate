import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {observeCustomFood} from 'src/services/firebase/database/custom-food';
import {userSelector} from 'src/store/selectors';

function useCustomFood() {
  const {user} = useSelector(userSelector);
  const [customFood, setCustomFood] = useState();

  const onCustomFoodChange = food => {
    console.log('onCustomFoodChange', food);
    if (!food) return;
    setCustomFood(food);
  };

  useEffect(() => {
    if (user) {
      observeCustomFood(user.uid, onCustomFoodChange);
    }
  }, [user]);

  return {customFood};
}

export default useCustomFood;
