class Solution {
public:
    bool isNStraightHand(vector<int>& hand, int groupSize) {
        if (hand.size() % groupSize) return false;
        vector<int> cards = hand;
        sort(cards.begin(), cards.end());
        while (!cards.empty()) {
            int x = cards[0];
            for (int d = 0; d < groupSize; d++) {
                auto it = find(cards.begin(), cards.end(), x + d);   // O(n) search + removal
                if (it == cards.end()) return false;
                cards.erase(it);
            }
        }
        return true;
    }
};
