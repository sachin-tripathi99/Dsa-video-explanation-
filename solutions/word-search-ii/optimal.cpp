class Solution {
    struct Node { Node* next[26] = {}; string word; bool end = false; };
    vector<string> res;
    void dfs(vector<vector<char>>& b, int r, int c, Node* parent) {
        if (r < 0 || c < 0 || r >= (int)b.size() || c >= (int)b[0].size() || b[r][c] == '#') return;
        Node* node = parent->next[b[r][c] - 'a'];
        if (!node) return;                                  // not a prefix of any word → prune
        if (node->end) { res.push_back(node->word); node->end = false; }   // report once
        char ch = b[r][c];
        b[r][c] = '#';
        dfs(b, r + 1, c, node); dfs(b, r - 1, c, node); dfs(b, r, c + 1, node); dfs(b, r, c - 1, node);
        b[r][c] = ch;
    }
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
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
        for (int r = 0; r < (int)board.size(); r++)
            for (int c = 0; c < (int)board[0].size(); c++) dfs(board, r, c, root);
        return res;
    }
};
