class Solution {
public:
    int majorityElement(vector<int>& nums) {
        unordered_map<int, int> counts;
        for (int x : nums) {
            if (++counts[x] > (int)nums.size() / 2) return x;
        }
        return -1;
    }
};
