class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left = 0, right = numbers.size() - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return {left + 1, right + 1};
            if (sum > target) right--;   // too big: the largest can't be used
            else left++;                 // too small: the smallest can't be used
        }
        return {-1, -1};
    }
};
