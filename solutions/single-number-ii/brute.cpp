class Solution {
public:
    int singleNumber(vector<int>& nums) {
        unordered_map<int, int> count;
        for (int x : nums) count[x]++;
        for (auto& [x, c] : count) if (c == 1) return x;
        return -1;
    }
};
