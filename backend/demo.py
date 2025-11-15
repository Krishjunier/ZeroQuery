import tensorflow as tf

dataset = tf.data.Dataset.from_tensor_slices([1, 2, 3])
for element in dataset:
    print(element.numpy())
