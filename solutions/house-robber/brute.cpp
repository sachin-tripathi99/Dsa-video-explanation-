class Solution {
    int best(vector<int>& a, int i) {                       // most money from houses 0..i
        if (i < 0) return 0;
        return max(best(a, i - 1), best(a, i - 2) + a[i]);  // skip or rob house i
    }
public:
    int rob(vector<int>& nums) {
        return best(nums, nums.size() - 1);
    }
};
