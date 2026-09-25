class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int candidate = 0, count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x;          // start a new candidate
            count += (x == candidate) ? 1 : -1;     // support or cancel
        }
        return candidate;
    }
};
