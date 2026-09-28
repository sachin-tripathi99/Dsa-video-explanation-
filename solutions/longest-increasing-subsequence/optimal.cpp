class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;                                  // smallest tail per length
        for (int x : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), x);   // first tail ≥ x
            if (it == tails.end()) tails.push_back(x);
            else *it = x;
        }
        return tails.size();
    }
};
