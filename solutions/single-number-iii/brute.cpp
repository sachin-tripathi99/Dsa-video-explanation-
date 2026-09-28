class Solution {
public:
    vector<int> singleNumber(vector<int>& nums) {
        unordered_map<int, int> count;
        for (int x : nums) count[x]++;
        vector<int> res;
        for (auto& [x, c] : count) if (c == 1) res.push_back(x);
        return res;
    }
};
