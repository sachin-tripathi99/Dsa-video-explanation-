class Solution {
public:
    int maxEnvelopes(vector<vector<int>>& envelopes) {
        sort(envelopes.begin(), envelopes.end(), [](auto& a, auto& b) { return a[0] != b[0] ? a[0] < b[0] : a[1] > b[1]; });   // w ↑, h ↓
        vector<int> tails;
        for (auto& e : envelopes) {                         // LIS on heights
            auto it = lower_bound(tails.begin(), tails.end(), e[1]);
            if (it == tails.end()) tails.push_back(e[1]);
            else *it = e[1];
        }
        return tails.size();
    }
};
