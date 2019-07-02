import {
  Dialog,
  DialogContent,
  Grid,
  LinearProgress,
  Theme
} from '@material-ui/core';
import * as React from 'react';
import { DialogAppBar } from './DialogAppBar/DialogAppBar';
import { DialogTransition } from './DialogTransition/DialogTransition';
import { Form } from './Form/Form';
import { History } from './History/History';
import classNames from 'classnames';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Category, Image } from '@piximi/types';
import { createModel } from '../../../network';
import { createTrainAndTestSet } from '../../../dataset';
import * as tensorflow from '@tensorflow/tfjs';
//import * as tfvis from '@tensorflow/tfjs-vis';
import { useState } from 'react';

const drawerWidth = 280;

type DataPoint = { x: Number; y: Number };
type Data = DataPoint[];

const lossFunctions = {
  absoluteDifference: 'Absolute difference',
  cosineDistance: 'Cosine distance',
  hingeLoss: 'Hinge',
  huberLoss: 'Huber',
  logLoss: 'Log',
  meanSquaredError: 'Mean squared error (MSE)',
  sigmoidCrossEntropy: 'Sigmoid cross entropy',
  softmaxCrossEntropy: 'Softmax cross entropy',
  categoricalCrossentropy: 'Categorical cross entropy'
};

const optimizationAlgorithms: { [identifier: string]: any } = {
  adadelta: tensorflow.train.adadelta,
  adam: tensorflow.train.adam,
  adamax: tensorflow.train.adamax,
  rmsprop: tensorflow.train.rmsprop,
  sgd: tensorflow.train.sgd
};

const styles = (theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    contentLeft: {
      marginLeft: 0
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    contentShiftLeft: {
      marginLeft: drawerWidth
    },
    paper: {
      zIndex: 1100
    }
  });

const useStyles = makeStyles(styles);

type FitClassifierDialogProps = {
  categories: Category[];
  closeDialog: () => void;
  images: Image[];
  openedDialog: boolean;
  openedDrawer: boolean;
};

export const FitClassifierDialog = (props: FitClassifierDialogProps) => {
  const { categories, closeDialog, images, openedDialog, openedDrawer } = props;

  const styles = useStyles({});

  const [stopTraining, setStopTraining] = useState<boolean>(false);

  const [batchSize, setBatchSize] = useState<number>(32);
  const [epochs, setEpochs] = useState<number>(10);
  const [optimizationAlgorithm, setOptimizationAlgorithm] = useState<string>(
    'adam'
  );
  const [learningRate, setLearningRate] = useState<number>(0.01);
  const [lossFunction, setLossFunction] = useState<string>(
    'categoricalCrossentropy'
  );
  const [inputShape, setInputShape] = useState<string>('224, 224, 3');
  const [trainingLossHistory, setTrainingLossHistory] = useState<Data>([]);
  const [trainingAccuracyHistory, setTrainingAccuracyHistory] = useState<
    number[]
  >([]);
  const [validationLossHistory, setValidationLossHistory] = useState<number[]>(
    []
  );
  const [validationAccuracyHistory, setValidationAccuracyHistory] = useState<
    number[]
  >([]);

  const onBatchSizeChange = (event: React.FormEvent<EventTarget>) => {
    const target = event.target as HTMLInputElement;
    var value = Number(target.value);

    setBatchSize(value);
  };

  const onEpochsChange = (event: React.FormEvent<EventTarget>) => {
    const target = event.target as HTMLInputElement;
    var value = Number(target.value);

    setEpochs(value);
  };

  const onStopTrainingChange = (state: boolean) => {
    setStopTraining(state);
  };

  const resetStopTraining = async () => {
    console.log('reset stop');
    await setStopTraining(false);
  };

  const onInputShapeChange = (event: React.FormEvent<EventTarget>) => {
    const target = event.target as HTMLInputElement;

    setInputShape(target.value);
  };

  const onLearningRateChange = (event: React.FormEvent<EventTarget>) => {
    const target = event.target as HTMLInputElement;
    var value = Number(target.value);

    setLearningRate(value);
  };

  const onLossFunctionChange = (event: React.FormEvent<EventTarget>) => {
    const target = event.target as HTMLInputElement;

    setLossFunction(target.value);
  };

  const onOptimizationAlgorithmChange = (
    event: React.FormEvent<EventTarget>
  ) => {
    const target = event.target as HTMLInputElement;

    setOptimizationAlgorithm(target.value);
  };

  const className = classNames(styles.content, styles.contentLeft, {
    [styles.contentShift]: openedDrawer,
    [styles.contentShiftLeft]: openedDrawer
  });

  const classes = {
    paper: styles.paper
  };

  const fit = async () => {
    const numberOfClasses: number = categories.length - 1;
    if (numberOfClasses === 1) {
      alert('The classifier must have at least two classes!');
      return;
    }
    console.log('create model...');

    const optimizer: tensorflow.Optimizer = optimizationAlgorithms[
      optimizationAlgorithm
    ](learningRate);

    const model = await createModel(
      numberOfClasses,
      100,
      lossFunction,
      ['accuracy'],
      optimizer
    );
    console.log('... created model');

    console.log(tensorflow.memory());

    console.log('create dataset...');
    const { trainData, testData } = await createTrainAndTestSet(
      categories,
      images
    );
    const x = trainData.data;
    const y = trainData.lables;
    console.log('...created dataset');
    let counter: number = 1;

    const args = {
      batchSize: batchSize,
      callbacks: {
        onTrainBegin: async (logs?: tensorflow.Logs | undefined) => {
          console.log(`onTrainBegin`);
        },
        onTrainEnd: async (logs?: tensorflow.Logs | undefined) => {},
        onEpochBegin: async (
          epoch: number,
          logs?: tensorflow.Logs | undefined
        ) => {
          console.log(`onEpochBegin ${epoch}`);
        },
        onEpochEnd: async (
          epoch: number,
          logs?: tensorflow.Logs | undefined
        ) => {
          if (stopTraining) {
            console.log('test train stop');
            model.stopTraining = true;
          }
        },
        onBatchBegin: async (
          batch: number,
          logs?: tensorflow.Logs | undefined
        ) => {
          console.log(`onBatchBegin ${batch}`);
        },
        onBatchEnd: async (
          batch: number,
          logs?: tensorflow.Logs | undefined
        ) => {
          const evaluation = (await model.evaluate(
            x,
            y
          )) as tensorflow.Scalar[];
          console.log(`onBatchEnd ${batch}`);
          if (logs) {
            console.log(`loss: ${logs.loss}, accurcy: ${logs.acc}`);
            const x: number = counter;
            const dataPoint: DataPoint = { x: x, y: logs.loss };
            trainingLossHistory.push(dataPoint);
            setTrainingLossHistory(trainingLossHistory);
            counter += 1;
          }
        }
      },
      epochs: epochs,
      verbose: 1
    };

    console.log('fit the model...');
    const history = await model.fit(x, y, args);

    console.log('trainingLossHistory:');
    console.log(trainingLossHistory);

    console.log('done with training!');
    await model.save('indexeddb://mobileNet');
    console.log('saved the model!');
  };

  const onFit = async () => {
    const startTime = new Date().getTime();

    await fit().then(() => {});

    const endTime = new Date().getTime();
    const seconds = Math.round((endTime - startTime) / 1000); //in seconds
    console.log(seconds + ' seconds');
  };

  return (
    <Dialog
      className={className}
      classes={classes}
      disableBackdropClick
      disableEscapeKeyDown
      fullScreen
      onClose={closeDialog}
      open={openedDialog}
      TransitionComponent={DialogTransition}
      style={{ zIndex: 1100 }}
    >
      <DialogAppBar
        onStopTrainingChange={onStopTrainingChange}
        closeDialog={closeDialog}
        fit={onFit}
        openedDrawer={openedDrawer}
      />

      <DialogContent>
        <History data={trainingLossHistory} />

        <Form
          batchSize={batchSize}
          closeDialog={closeDialog}
          epochs={epochs}
          inputShape={inputShape}
          learningRate={learningRate}
          lossFunction={lossFunction}
          onBatchSizeChange={onBatchSizeChange}
          onEpochsChange={onEpochsChange}
          onInputShapeChange={onInputShapeChange}
          onLearningRateChange={onLearningRateChange}
          onLossFunctionChange={onLossFunctionChange}
          onOptimizationAlgorithmChange={onOptimizationAlgorithmChange}
          openedDialog={openedDialog}
          optimizationAlgorithm={optimizationAlgorithm}
        />
      </DialogContent>
    </Dialog>
  );
};
