class Solution {
public:
    bool isNStraightHand(vector<int>& hand, int groupSize) {
        if (hand.size() % groupSize) return false;
        map<int, int> cnt;
        for (int x : hand) cnt[x]++;
        for (auto& [x, m0] : cnt) {                          // increasing order
            int m = m0;
            if (m == 0) continue;
            for (int d = 0; d < groupSize; d++) {            // m groups start at x
                auto it = cnt.find(x + d);
                if (it == cnt.end() || it->second < m) return false;
                it->second -= m;
            }
        }
        return true;
    }
};
