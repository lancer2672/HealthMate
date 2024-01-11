import {OnboardFlow} from 'react-native-onboard';

const OnboardComponent = ({onDone}) => {
  return (
    <OnboardFlow
      onDone={onDone}
      pages={[
        {
          title: 'Meal Planning',
          subtitle: 'Create your meal plan, choose your favorite foods',
          imageUri: 'https://frigade.com/img/example2.png' // Đường dẫn tới ảnh về meal plan
        },
        {
          title: 'Workout',
          subtitle: 'Create your workout routine, choose your exercises',
          imageUri: 'https://frigade.com/img/example1.png' // Đường dẫn tới ảnh về workout
        }
      ]}
      type={'fullscreen'}
    />
  );
};

export default OnboardComponent;
