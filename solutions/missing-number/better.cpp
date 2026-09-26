class Solution {
public:
    int missingNumber(vector<int>& nums) {
        unordered_set<int> seen(nums.begin(), nums.end());
        int x = 0;
        while (seen.count(x)) x++;
        return x;
    }
};
