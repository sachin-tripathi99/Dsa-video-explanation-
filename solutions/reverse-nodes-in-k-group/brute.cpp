class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode* p = head;
        while (p) {
            vector<ListNode*> group;
            ListNode* q = p;
            while (q && (int)group.size() < k) { group.push_back(q); q = q->next; }
            if ((int)group.size() < k) break;
            for (int i = 0, j = k - 1; i < j; i++, j--) swap(group[i]->val, group[j]->val);   // swap values
            p = q;
        }
        return head;
    }
};
