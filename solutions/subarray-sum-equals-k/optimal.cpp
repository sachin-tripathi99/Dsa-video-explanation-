class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> count{{0, 1}};    // the empty prefix
        int run = 0, ans = 0;
        for (int x : nums) {
            run += x;
            auto it = count.find(run - k);
            if (it != count.end()) ans += it->second;
            count[run]++;
        }
        return ans;
    }
};
