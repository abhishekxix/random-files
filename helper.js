db.persons
  .aggregate([
    { $match: { gender: 'female' } },
    {
      $group: { _id: { state: '$location.state' }, totalPersons: { $sum: 1 } },
    },
    { $sort: { totalPersons: -1 } },
  ])
  .pretty();

db.persons
  .aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        gender: 1,
        email: 1,
        birthDate: { $convert: { input: '$dob.date', to: 'date' } },
        age: 'dob.age',
        location: {
          type: 'Point',
          coordinates: [
            {
              $convert: {
                input: '$location.coordinates.longitude',
                to: 'double',
                onError: 0.0,
                onNull: 0,
              },
            },
            {
              $convert: {
                input: '$location.coordinates.latitude',
                to: 'double',
                onError: 0.0,
                onNull: 0,
              },
            },
          ],
        },
      },
    },

    {
      $project: {
        gender: 1,
        email: 1,
        location: 1,
        age: 1,
        birthDate: 1,
        // fullName: {
        //   $concat: [
        //     { $toUpper: { $substrCP: ['$name.first', 0, 1] } },
        //     {
        //       $substrCP: [
        //         '$name.first',
        //         1,
        //         { $subtract: [{ $strLenCP: '$name.first' }, 1] },
        //       ],
        //     },
        //     ' ',
        //     { $toUpper: { $substrCP: ['$name.last', 0, 1] } },
        //     {
        //       $substrCP: [
        //         '$name.first',
        //         1,
        //         { $subtract: [{ $strLenCP: '$name.last' }, 1] },
        //       ],
        //     },
        //   ],
        // },
      },
    },
    {
      $group: {
        _id: { birthYear: { $isoWeekYear: '$birthDate' } },
        numPersons: { $sum: 1 },
      },
    },
  ])
  .pretty();
/* 



*/

db.friends
  .aggregate([
    { $unwind: '$hobbies' },
    // { $group: { _id: { age: '$age' }, allHobbies: { $addToSet: '$hobbies' } } },
    // { $project: { _id: 0, examScore: { $slice: ['$examScores', 1] } } },
    {
      $project: {
        _id: 0,
        examScores: {
          $filter: {
            input: '$examScores',
            as: 'sc',
            cond: { $gt: ['$$sc.score', 60] },
          },
        },
      },
    },
  ])
  .pretty();

db.friends.aggregate([
  { $unwind: '$examScores' },
  { $project: { _id: 1, name: 1, age: 1, score: '$examScores.score' } },
  { $sort: { score: -1 } },
  {
    $group: {
      _id: '$_id',
      name: { $first: '$name' },
      maxScore: { $max: '$score' },
    },
  },
]);

/* 


*/

db.persons
  .aggregate([
    {
      $bucket: {
        groupBy: '$dob.age',
        boundaries: [0, 18, 30, 50, 80, 120],
        output: {
          numPersons: { $sum: 1 },
          averageAge: { $avg: '$dob.age' },
          names: { $push: '$name.first' },
        },
      },
    },
  ])
  .pretty();

db.persons.aggregate([
  {
    $bucket: {
      groupBy: '$dob.age',
      boundaries: [0, 18, 30, 50, 80, 120],
      output: {
        numPersons: { $sum: 1 },
        averageAge: { $avg: '$dob.age' },
        // names: { $addToSet: '$name.first' },
      },
    },
  },
]);

/* 


*/

db.persons
  .aggregate([
    { $project: { _id: 0, name: 1, birthDate: { $toDate: '$dob.date' } } },
    { $sort: { birthDate: 1 } },
    { $limit: 10 },
  ])
  .pretty();
/* 


*/

db.persons
  .aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        birthdate: { $toDate: '$dob.date' },
        age: '$dob.age',
        location: {
          type: 'Point',
          coordinates: [
            {
              $convert: {
                input: '$location.coordinates.longitude',
                to: 'double',
                onError: 0.0,
                onNull: 0.0,
              },
            },
            {
              $convert: {
                input: '$location.coordinates.latitude',
                to: 'double',
                onError: 0.0,
                onNull: 0.0,
              },
            },
          ],
        },
      },
    },
    {
      $project: {
        gender: 1,
        email: 1,
        location: 1,
        birthdate: 1,
        age: 1,
        fullName: {
          $concat: [
            { $toUpper: { $substrCP: ['$name.first', 0, 1] } },
            {
              $substrCP: [
                '$name.first',
                1,
                { $subtract: [{ $strLenCP: '$name.first' }, 1] },
              ],
            },
            ' ',
            { $toUpper: { $substrCP: ['$name.last', 0, 1] } },
            {
              $substrCP: [
                '$name.last',
                1,
                { $subtract: [{ $strLenCP: '$name.last' }, 1] },
              ],
            },
          ],
        },
      },
    },
    { $out: 'transformedPersons' },
  ])
  .pretty();
