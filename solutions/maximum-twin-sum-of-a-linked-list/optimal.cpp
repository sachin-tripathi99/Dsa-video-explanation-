class Solution {
public:
    int pairSum(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
        ListNode* prev = nullptr;                           // reverse the second half
        while (slow) {
            ListNode* next = slow->next;
            slow->next = prev;
            prev = slow;
            slow = next;
        }
        int best = 0;
        for (ListNode *a = head, *b = prev; b; a = a->next, b = b->next) best = max(best, a->val + b->val);
        return best;
    }
};
