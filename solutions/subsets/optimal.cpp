class Solution {
    vector<vector<int>> out;
    vector<int> path;
    void go(vector<int>& nums, int start) {
        out.push_back(path);                                // every node is a subset
        for (int i = start; i < (int)nums.size(); i++) {
            path.push_back(nums[i]);                        // choose
            go(nums, i + 1);                                // explore
            path.pop_back();                                // un-choose
        }
    }
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        go(nums, 0);
        return out;
    }
};
