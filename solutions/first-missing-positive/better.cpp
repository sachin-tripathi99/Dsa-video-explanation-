class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        int want = 1;
        for (int x : nums) {
            if (x == want) want++;
            else if (x > want) break;           // gap found
        }
        return want;
    }
};
