class Solution {
    vector<vector<int>> out;
    vector<int> path;
    vector<bool> used;
    void go(vector<int>& nums) {
        if (path.size() == nums.size()) { out.push_back(path); return; }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) continue;
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;   // left copy first
            used[i] = true; path.push_back(nums[i]);
            go(nums);
            path.pop_back(); used[i] = false;
        }
    }
public:
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        used.assign(nums.size(), false);
        go(nums);
        return out;
    }
};
