class Solution {
    set<vector<int>> seen;
    vector<int> path;
    vector<bool> used;
    void go(vector<int>& nums) {
        if (path.size() == nums.size()) { seen.insert(path); return; }   // set drops duplicates
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) continue;
            used[i] = true; path.push_back(nums[i]);
            go(nums);
            path.pop_back(); used[i] = false;
        }
    }
public:
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        used.assign(nums.size(), false);
        go(nums);
        return vector<vector<int>>(seen.begin(), seen.end());
    }
};
