class Solution {
    struct Node { Node* next[26] = {}; vector<string> top; };
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        Node* root = new Node();
        for (auto& s : products) {                          // sorted order → first 3 are smallest
            Node* cur = root;
            for (char ch : s) {
                if (!cur->next[ch - 'a']) cur->next[ch - 'a'] = new Node();
                cur = cur->next[ch - 'a'];
                if (cur->top.size() < 3) cur->top.push_back(s);
            }
        }
        vector<vector<string>> res;
        Node* cur = root;
        for (char ch : searchWord) {
            cur = cur ? cur->next[ch - 'a'] : nullptr;      // one step per keystroke
            res.push_back(cur ? cur->top : vector<string>{});
        }
        return res;
    }
};
