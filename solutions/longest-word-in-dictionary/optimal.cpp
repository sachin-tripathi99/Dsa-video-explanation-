class Solution {
    struct Node { Node* next[26] = {}; string word; bool end = false; };
    string best;
    void dfs(Node* node) {
        for (Node* kid : node->next) {                      // letter order → ties resolved
            if (!kid || !kid->end) continue;                // only through word ends
            if (kid->word.size() > best.size()) best = kid->word;
            dfs(kid);
        }
    }
public:
    string longestWord(vector<string>& words) {
        Node* root = new Node();
        for (auto& w : words) {
            Node* cur = root;
            for (char ch : w) {
                if (!cur->next[ch - 'a']) cur->next[ch - 'a'] = new Node();
                cur = cur->next[ch - 'a'];
            }
            cur->end = true;
            cur->word = w;
        }
        dfs(root);
        return best;
    }
};
