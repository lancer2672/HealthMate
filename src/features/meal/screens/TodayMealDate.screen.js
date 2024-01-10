import {useEffect, useLayoutEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// import SearchInput from '../components/SearchInput.component';
import * as Progress from 'react-native-progress';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';
import {
  observeHistoryMealsToday,
  setHistoryMeal
} from 'src/services/firebase/database/meal-history';
import {useAppDispatch} from 'src/store/hooks';
import {getFoodMealByDate} from 'src/store/reducer/thunks/foodMealActions';
import {userSelector} from 'src/store/selectors';
import {capitalizeFirstLetter} from 'src/utils/tranformData';
import {useTheme} from 'styled-components';
import ListFood from '../components/ListFood.component';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TodayMealDate({route, navigation}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [breakfast, setBreakfast] = useState([]);
  const [meal, setMeal] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [completePercent, setCompletePercent] = useState(0);
  const [visible, setMenuVisible] = useState(0);
  const [saveVisible, setMenuSaveVisible] = useState(0);
  const [createFoodVisible, setCreateFoodVisible] = useState(false);
  const [loadVisible, setMenuLoadVisible] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {user} = useSelector(userSelector);

  const isToday = () => {
    const today = new Date();
    return (
      today.getDate() === currentDate.getDate() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const nameDay = () => {
    const dayOfWeek = currentDate.getDay();
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    return daysOfWeek[dayOfWeek];
  };
  useLayoutEffect(() => {
    if (user) {
      const handleUpdateMeals = meal => {
        console.log('handleUpdateMeals', meal);
        if (!meal) return;
        setBreakfast(meal.breakfast?.map(transformData) || []);
        setLunch(meal.lunch?.map(transformData) || []);
        setDinner(meal.dinner?.map(transformData) || []);
        setSnacks(meal.snacks?.map(transformData) || []);
        getCompletePercent(meal);
        setMeal(meal);
      };

      observeHistoryMealsToday(user.uid, handleUpdateMeals);
    }
  }, [user]);
  const getFulfiledPercent = () => {};

  const transformData = d => {
    if (!d.foodName) return d;
    const capFoodName = capitalizeFirstLetter(d.foodName);
    return {
      ...d,
      foodName: capFoodName,
      isDone: false
    };
  };
  const handleNavigateSeacrch = mealName => {
    const serializableDate = currentDate.toISOString();
    navigation.navigate('Search food', {
      data: {
        mealName: mealName,
        currentDate: serializableDate
      }
    });
  };

  useEffect(() => {
    if (user) {
      dispatch(
        getFoodMealByDate({
          userId: user.uid,
          date: currentDate.toISOString(),
          mealName: 'breakfast'
        })
      );
    }
  }, []);
  const calculateTotal = (session, nutrient) => {
    return session.reduce((ac, i) => {
      return ac + i.realQty * i[nutrient];
    }, 0);
  };

  const getTotalNutrient = nutrient => {
    const breakfastC = calculateTotal(breakfast, nutrient);
    const lunchC = calculateTotal(lunch, nutrient);
    const dinnerC = calculateTotal(dinner, nutrient);
    const snacksC = calculateTotal(snacks, nutrient);
    return breakfastC + lunchC + dinnerC + snacksC;
  };

  const getTotalCalories = () => getTotalNutrient('realCalories');
  const getTotalFat = () => getTotalNutrient('realFat');
  const getTotalCarbo = () => getTotalNutrient('realCarbo');
  const getTotalProtein = () => getTotalNutrient('realProtein');

  const getCompletePercent = meal => {
    const foods = [];
    for (const value of Object.values(meal)) {
      foods.push(...value);
    }
    const completedFoods = foods.filter(t => t.isDone);
    if (foods.length == 0) {
      setCompletePercent(0);
    } else {
      setCompletePercent(completedFoods.length / foods.length);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: theme.secondary,
          padding: 14
        }}>
        {/* <TouchableOpacity
          style={{width: 30}}
          onPress={() => {
            handleChangeDate(-1);
          }}>
          <Entypo name="chevron-left" size={32} color="white"></Entypo>
        </TouchableOpacity> */}
        <View>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
            {(isToday() ? 'Today' : nameDay()) +
              ', ' +
              currentDate.getDate() +
              '/' +
              (currentDate.getMonth() + 1) +
              '/' +
              currentDate.getFullYear()}
          </Text>
        </View>
        {/* <TouchableOpacity
          style={{width: 30}}
          onPress={() => handleChangeDate(1)}>
          <Entypo name="chevron-right" size={32} color="white"></Entypo>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={{width: 30}}
          onPress={() => setMenuVisible(true)}>
          <Entypo name="dots-three-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{paddingHorizontal: 12, marginVertical: 12}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>
            {getTotalCalories()}
          </Text>
          <Text style={{color: 'black', fontSize: 16}}> Calories</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {getTotalFat()}
            </Text>
            <Text style={{color: 'black'}}> g Fat</Text>
          </Text>
          <Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {getTotalProtein()}
            </Text>
            <Text style={{color: 'black'}}> g Protein</Text>
          </Text>
          <Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {getTotalCarbo()}
            </Text>
            <Text style={{color: 'black'}}> g Carbs</Text>
          </Text>
        </View>
      </View>

      <View>
        <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
          {(completePercent * 100).toFixed(2)}%
        </Text>
        <Progress.Bar
          progress={completePercent}
          width={SCREEN_WIDTH - 40}
          borderWidth={0}
          color={'#0265D2'}
          unfilledColor={'#c9c9c9'}
          style={{marginLeft: 'auto', marginRight: 'auto', marginVertical: 12}}
        />
      </View>

      {isLoading ? (
        <></>
      ) : (
        <View>
          <ListFood
            mealName="Breakfast"
            foodMeal={breakfast}
            handleNavigateSeacrch={() => {
              handleNavigateSeacrch('breakfast');
            }}
            navigation={navigation}
          />
          <ListFood
            mealName="Lunch"
            foodMeal={lunch}
            handleNavigateSeacrch={() => {
              handleNavigateSeacrch('lunch');
            }}
            navigation={navigation}
          />
          <ListFood
            mealName="Dinner"
            foodMeal={dinner}
            handleNavigateSeacrch={() => {
              handleNavigateSeacrch('dinner');
            }}
            navigation={navigation}
          />
          <ListFood
            mealName="Snacks"
            foodMeal={snacks}
            handleNavigateSeacrch={() => {
              handleNavigateSeacrch('snacks');
            }}
            navigation={navigation}
          />
        </View>
      )}
      <BottomMenu
        visible={visible}
        openSaveMenu={() => {
          setMenuSaveVisible(true);
        }}
        openLoadMenu={() => {
          setMenuLoadVisible(true);
        }}
        openCustomFood={() => {
          setCreateFoodVisible(true);
        }}
        onClose={() => setMenuVisible(false)}></BottomMenu>
      <SavePlanBottomMenu
        visible={saveVisible}
        meal={meal}
        onClose={() => setMenuSaveVisible(false)}></SavePlanBottomMenu>
      <LoadPlanBottomMenu
        visible={loadVisible}
        onClose={() => setMenuLoadVisible(false)}></LoadPlanBottomMenu>
      <CreateCustomFood
        visible={createFoodVisible}
        onClose={() => {
          setCreateFoodVisible(false);
        }}></CreateCustomFood>
    </View>
  );
}

import {Modal, TextInput, TouchableWithoutFeedback} from 'react-native';
import {Button} from 'react-native-paper';

import {observeTodayMeal, saveMeal} from 'src/services/firebase/database/meal';
const BottomMenu = ({
  visible,
  onClose,
  openCustomFood,
  openSaveMenu,
  openLoadMenu,
  plan
}) => {
  const {user} = useSelector(userSelector);
  const handleSavePlan = () => {
    onClose();
    openSaveMenu();
  };
  const handleCreateFood = () => {
    onClose();
    openCustomFood();
  };
  const handleLoadMealPlan = () => {
    onClose();
    openLoadMenu();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end'
          }}>
          <View style={menuStyles.body}>
            <View style={menuStyles.options}></View>

            <TouchableOpacity
              style={[menuStyles.optionContainer]}
              onPress={handleCreateFood}>
              <Text style={menuStyles.option}>Add new food</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[menuStyles.optionContainer]}
              onPress={handleSavePlan}>
              <Text style={menuStyles.option}>Save plan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[menuStyles.optionContainer]}
              onPress={handleLoadMealPlan}>
              <Text style={menuStyles.option}>Load plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const SavePlanBottomMenu = ({visible, onClose, meal}) => {
  const {user} = useSelector(userSelector);
  const [planName, setPlanName] = useState();
  const savePlan = async () => {
    await saveMeal({userId: user.uid, planName, meal});
    onClose();
    setPlanName('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end'
          }}>
          <View style={menuStyles.body}>
            <View style={menuStyles.options}></View>

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginLeft: 6,
                margin: 12,
                justifyContent: 'space-between'
              }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: 'gray',
                  color: 'white',
                  borderRadius: 8
                }}
                onChangeText={setPlanName}
                placeholderTextColor={'white'}
                placeholder="Your plan name"
                value={planName}
              />
              <Button
                style={menuStyles.button}
                mode="contained"
                onPress={savePlan}>
                Add
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const LoadPlanBottomMenu = ({visible, onClose}) => {
  const {user} = useSelector(userSelector);
  const [selectedMealPlan, setSelectedMealPlan] = useState();

  const handleLoadMealPlan = async () => {
    if (selectedMealPlan) {
      const promises = [];
      for (const [mealType, value] of Object.entries(selectedMealPlan)) {
        promises.push(
          setHistoryMeal({userId: user.uid, meal: value, mealType})
        );
      }
      await Promise.all(promises);

      // await setHistoryMeal({ userId: user.uid,meal})
    }
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end'
          }}>
          <View style={menuStyles.body}>
            <View style={menuStyles.options}></View>
            <View
              style={[
                styles.optionContainer,
                {flexDirection: 'row', alignItems: 'center'}
              ]}>
              <PlanDropdown
                selectedItem={selectedMealPlan}
                onItemSelected={setSelectedMealPlan}></PlanDropdown>
              <TouchableOpacity onPress={handleLoadMealPlan}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    padding: 12,
                    fontSize: 18,
                    marginRight: 12
                  }}>
                  Load
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

import {Dropdown} from 'react-native-element-dropdown';
import CreateCustomFood from 'src/features/food/components/CreateCustomFood';

const PlanDropdown = ({selectedItem, onItemSelected}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const {user} = useSelector(userSelector);
  const [mealPlans, setMealPlans] = useState([]);
  const onItemSelection = async item => {
    console.log('onItemSelection', item);
    // setValue(item.value);
    onItemSelected(() => item.value);
    setIsFocus(false);
  };
  useLayoutEffect(() => {
    if (user) {
      const handleUpdateMeals = meal => {
        if (!meal) return;
        const plans = [];
        for (const [key, value] of Object.entries(meal)) {
          plans.push({
            label: key,
            value: value
          });
        }

        setMealPlans(plans);
      };
      observeTodayMeal(user.uid, handleUpdateMeals);
    }
  }, [user]);
  return (
    <View style={dropdownStyles.container}>
      <Dropdown
        style={[dropdownStyles.dropdown]}
        placeholderStyle={dropdownStyles.placeholderStyle}
        selectedTextStyle={dropdownStyles.selectedTextStyle}
        // inputSearchStyle={dropdownStyles.inputSearchStyle}
        iconStyle={dropdownStyles.iconStyle}
        data={mealPlans}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={'Select a meal plan'}
        value={selectedItem}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={onItemSelection}
        // renderLeftIcon={() => (
        //   <Ionicons
        //     style={dropdownStyles.icon}
        //     color={'black'}
        //     name="body-outline"
        //     size={20}
        //   />
        // )}
      />
    </View>
  );
};

const dropdownStyles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    padding: 4,
    flex: 1
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    backgroundColor: 'black',
    paddingHorizontal: 8
  },
  icon: {
    marginRight: 5
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white'
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16
  }
});

const menuStyles = StyleSheet.create({
  optionContainer: {
    borderColor: 'gray',
    borderTopWidth: 1,
    justifyContent: 'center',
    paddingVertical: 8,
    width: '100%'
  },
  body: {
    backgroundColor: 'black',
    borderTopLeftRadius: 12,

    borderTopRightRadius: 12,
    borderColor: 'white'
  },
  options: {
    height: 12,
    width: 100,
    alignSelf: 'center',
    borderBottomWidth: 2,
    borderColor: 'white',
    marginBottom: 12
  },
  option: {
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 18,
    color: 'white'
  },
  button: {
    borderRadius: 4,
    borderWidth: 2,
    margin: 12,
    alignSelf: 'flex-end',
    borderColor: 'black',
    backgroundColor: 'black'
  }
});

const styles = StyleSheet.create({
  calContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: 'blue'
  },
  mealContainer: {
    flexDirection: 'column',
    // margin: 10,
    borderBottomWidth: 1,
    borderColor: 'blue'
  },
  mealName: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  }
});
