class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        unordered_set<int> seen(nums.begin(), nums.end());
        int x = 1;
        while (seen.count(x)) x++;
        return x;
    }
};
