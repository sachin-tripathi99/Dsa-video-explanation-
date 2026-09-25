class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return new int[]{left + 1, right + 1};
            if (sum > target) right--;   // too big: the largest can't be used
            else left++;                 // too small: the smallest can't be used
        }
        return new int[]{-1, -1};
    }
}
