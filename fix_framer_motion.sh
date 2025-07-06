#!/bin/bash
for file in $(find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -l "framer-motion"); do
  echo "Fixing $file"
  sed -i "" "s/import { motion, AnimatePresence } from \"framer-motion\";/\/\/ import { motion, AnimatePresence } from \"framer-motion\";/" "$file"
  sed -i "" "s/import { motion } from \"framer-motion\";/\/\/ import { motion } from \"framer-motion\";/" "$file"
  sed -i "" "s/const MotionBox = motion(Box);/const MotionBox = Box;/" "$file"
  sed -i "" "s/const MotionDiv = motion.div;/const MotionDiv = \"div\";/" "$file"
  sed -i "" "s/const MotionHStack = motion(HStack);/const MotionHStack = HStack;/" "$file"
  sed -i "" "s/AnimatePresence/React.Fragment/g" "$file"
done
